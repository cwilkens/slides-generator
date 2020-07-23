import { expect } from 'chai';
import { Server } from 'http';
import * as request from 'request';
import 'mocha';

import { createServer } from './baseserver';

describe('Server integration tests', () => {
    describe('Proxy functionality', () => {

        let server: Server;
        before((done) => {
            server = createServer();
            server.listen(80, () => {
                done();
            });
        });

        var proxyUrl = "http://localhost/proxy/https://github.com/cwilkens/slides-generator/raw/master/screenshot.png";
        it('should return status 200', (done) => {
            request(proxyUrl, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('should proxy a URL', (done) => {
            request(proxyUrl, function(err, res, body) {
                expect(body).to.not.be.empty;
                done();
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });
    });
});