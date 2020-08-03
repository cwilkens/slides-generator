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
                expect(res.statusCode).to.equal(200);
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

    describe('Scraper functionality', () => {
        let server: Server;
        before((done) => {
            server = createServer();
            server.listen(80, () => {
                done();
            });
        });

        var scraperSearchUrl = "http://localhost/search/?search=cats";
        it('should return status 200', (done) => {
            request(scraperSearchUrl, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                done();
            });
        }).timeout(3000);
        it('should return three image thumbnails', (done) => {
            request(scraperSearchUrl, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                const images: string[] = body.toString().split("\n");
                expect(images.length).to.be.equal(3);
                done();
            });
        });

        var scraperImageUrl = "http://localhost/search/?search=cats&i=2";
        it('should return a high-res image', (done) => {
            request(scraperImageUrl, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.not.be.empty;
                done();
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });
    })
});