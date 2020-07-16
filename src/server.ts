import * as http from "http";

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Server is working! Headers:' + '\n' + JSON.stringify(req.headers, null, 2));
    res.end();
}).listen(80);