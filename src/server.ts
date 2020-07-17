import * as http from "http";
import * as https from "https";
import * as httpProxy from "http-proxy";

const HOST: string = process.env.HOST || '0.0.0.0';
const PORT: number = +(process.env.PORT || 8080);
const SSL: boolean = (process.env.SSL != undefined);

function parseUrl() {

}

function getHandler(proxy: httpProxy): http.RequestListener {

    return function(req, res) {
        console.log(req.url);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Server is working! Headers:' + '\n' + JSON.stringify(req.headers, null, 2));
        res.end();
        return;
    }
}

let proxy = httpProxy.createServer();
let requestHandler = getHandler(proxy);

let server: http.Server;
if (SSL) {
    server = https.createServer(requestHandler);
} else {
    server = http.createServer(requestHandler);
}

server.listen(PORT, HOST, () => {
    console.log('Running server on '+HOST+':'+PORT);
});