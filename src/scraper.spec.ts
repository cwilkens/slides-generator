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

        after(async () => {
            await scraper.quit();
        });
    });
});