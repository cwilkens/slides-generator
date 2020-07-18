import * as http from "http";
import * as https from "https";
import * as httpProxy from "http-proxy";
import * as url from "url";

const HOST: string = process.env.HOST || '0.0.0.0';
const PORT: number = +(process.env.PORT || 8080);
const SSL: boolean = (process.env.SSL != undefined);

const PROXY_PATH: string = "proxy/";
const SEARCH_PATH: string = "search/";

function parseUrl() {

}

function proxyRequest(req: http.IncomingMessage, res: http.ServerResponse, proxy: httpProxy, destination: string) {
    let parsedUrl = url.parse(destination);
    if (parsedUrl.host == null) {
        res.writeHead(404);
        res.end();
        return;
    }
    console.log("proxy target host: "+parsedUrl.host);
    console.log("destination: "+destination);
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

function getHandler(proxy: httpProxy): http.RequestListener {

    return function(req, res) {

        console.log(req.url);
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
            const search: string = req.url?.slice(SEARCH_PATH.length+1);
            // search stuff
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Server is working! Headers:' + '\n' + JSON.stringify(req.headers, null, 2));
        res.end();
        return;
    }
}

let proxy = httpProxy.createServer();
let requestHandler = getHandler(proxy);

// Listen for the error event on proxy.
proxy.on('error', function (err, req, res) {
    console.log("Error on proxy with request url: "+req.url);
    console.log("Error: "+err.name+" Message: "+err.message+"\n"+err.stack+"\n");
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong. Error logged in the server.');
});

// Listen for the proxyRes event on proxy.
proxy.on('proxyRes', function (proxyRes, req, res) {
    console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, null, 2));
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
});

let server: http.Server;
if (SSL) {
    server = https.createServer(requestHandler);
} else {
    server = http.createServer(requestHandler);
}

server.listen(PORT, HOST, () => {
    console.log('Running server on '+HOST+':'+PORT);
});