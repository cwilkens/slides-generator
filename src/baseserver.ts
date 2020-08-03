import * as http from "http";
import * as https from "https";
import * as httpProxy from "http-proxy";
import * as url from "url";
import * as querystring from "querystring";
import { Scraper } from './scraper';

const debug = require('debug');
const log = debug('server:base');

const SSL: boolean = (process.env.SSL != undefined);

const PROXY_PATH: string = "proxy/";
const SEARCH_PATH: string = "search/";

function proxyRequest(req: http.IncomingMessage, res: http.ServerResponse, proxy: httpProxy, destination: string) {
    let parsedUrl = url.parse(destination);
    if (parsedUrl.host == null) {
        res.writeHead(404);
        res.end();
        return;
    }
    log("proxy target host: "+parsedUrl.host);
    log("proxy destination: "+destination);
    let proxyOptions: httpProxy.ServerOptions = {
        changeOrigin: false,
        prependPath: false,
        target: destination,
        headers: {
            host: parsedUrl.host || ""
        }
    };
    req.url = parsedUrl.path || "";
    try {
        proxy.web(req, res, proxyOptions);
    } catch (err) {
        proxy.emit('error', err, req, res);
    }
}

function getHandler(proxy: httpProxy, scraper: Scraper): http.RequestListener {

    return function(req, res) {

        log(req.method + " " + req.url);
        if (req.method === 'OPTIONS') {
            res.setHeader("Access-Control-Allow-Origin", "*");
            if (req.headers['access-control-request-headers']) {
                res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
            }
            if (req.headers['access-control-request-method']) {
                res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
            }
            res.writeHead(200);
            res.end();
            return;
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (req.url?.slice(1).startsWith("favicon.ico")) {
            res.writeHead(404);
            res.end();
            return;
        }
        if (req.url?.slice(1).startsWith(PROXY_PATH)) {
            const destination: string = req.url?.slice(PROXY_PATH.length+1);
            proxyRequest(req, res, proxy, destination);
            return;
        }
        if (req.url?.slice(1).startsWith(SEARCH_PATH)) {
            // get query values
            const query = querystring.parse(req.url?.split("?")[1]);
            const searchText: string = (query.search || "").toString();
            if (searchText && /\S/.test(searchText)) {
                if (query.i === undefined) {
                    let images = scraper.getThumbnailsForSearch(searchText, 3);
                    images.then((base64Images) => {
                        res.writeHead(200, { 'Content-Type': 'text/plain', 'Connection': 'close' });
                        res.write(base64Images.join("\n"));
                        res.end();
                    });
                } else {
                    let bigImage = scraper.getSpecifiedImageUrlFromSearch(searchText, +query.i);
                    bigImage.then((imageUrl) => {
                        // returns URL of high-res image, so proxy it
                        proxyRequest(req, res, proxy, imageUrl);
                    });
                }
                return;
            }
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end();
        return;
    }
}

let proxy = httpProxy.createServer();
let scraper = new Scraper();
let requestHandler = getHandler(proxy, scraper);

// Listen for the error event on proxy.
proxy.on('error', function (err, req, res) {
    log("Error on proxy with request url: "+req.url);
    log("Error: "+err.name+" Message: "+err.message+"\n"+err.stack+"\n");
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong. Error logged in the server.');
});

// Listen for the proxyRes event on proxy.
proxy.on('proxyRes', function (proxyRes, req, res) {
    delete proxyRes.headers['set-cookie'];
    delete proxyRes.headers['set-cookie2'];

    // set CORS headers
    proxyRes.headers['access-control-allow-origin'] = '*';
    if (req.headers['access-control-request-method']) {
        proxyRes.headers['access-control-allow-methods'] = req.headers['access-control-request-method'];
        delete req.headers['access-control-request-method'];
    }
    if (req.headers['access-control-request-headers']) {
        proxyRes.headers['access-control-allow-headers'] = req.headers['access-control-request-headers'];
        delete req.headers['access-control-request-headers'];
    }
    log("proxy response headers: "+JSON.stringify(proxyRes.headers, null, 2));
});

export function createServer(): http.Server {
    let server: http.Server;
    if (SSL) {
        server = https.createServer(requestHandler);
    } else {
        server = http.createServer(requestHandler);
    }
    return server;    
}