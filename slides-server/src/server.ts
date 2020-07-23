import * as http from "http";
import { createServer } from "./baseserver"

const HOST: string = process.env.HOST || '0.0.0.0';
const PORT: number = +(process.env.PORT || 8080);

let server: http.Server = createServer();

server.listen(PORT, HOST, () => {
    console.log('Running server on '+HOST+':'+PORT);
});