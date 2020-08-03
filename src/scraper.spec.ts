import { expect } from 'chai';
import 'mocha';

import { Scraper } from './scraper';

describe('Scraper unit tests', () => {
    describe('Retrieving data', () => {

        let scraper: Scraper;
        before(() => {
            scraper = new Scraper();
        });

        it('should get page source', async () => {
            const page = await scraper.getPageSource();
            expect(page).to.be.not.empty;
        }).timeout(5000);

        it('should scrape thumbnails from search', async () => {
            const search = "cats";
            const imageCount = 10;
            const images = await scraper.getThumbnailsForSearch(search, imageCount);
            expect(images.length).to.be.equal(imageCount);
        }).timeout(5000);

        it('should turn thumbnails into a text block', async () => {
            const search = "cats";
            const imageCount = 10;
            const images = await scraper.getThumbnailsForSearch(search, imageCount);
            expect(images.length).to.be.equal(imageCount);
            const textBlock = images.join('\n');
            expect(textBlock).to.be.not.empty;
            expect(textBlock.split('\n').length).to.be.equal(imageCount);
        }).timeout(5000);

        it('should get a large image\'s url from search', async () => {
            const search = "cats";
            const imageIndex = 3;
            const imageUrl = await scraper.getSpecifiedImageUrlFromSearch(search, imageIndex);
            expect(imageUrl.slice(0, 4)).to.be.equal("http");
        }).timeout(5000);
        

        after(async () => {
            await scraper.quit();
        });
    });
});