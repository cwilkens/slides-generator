import { Browser, Builder, ThenableWebDriver, until, By } from 'selenium-webdriver';
import { Options, ServiceBuilder } from 'selenium-webdriver/chrome';
import * as chromedriver from 'chromedriver';

const CHROME_BINARY_PATH = process.env.CHROME_BINARY_PATH || "";
const CHROME_DRIVER_PATH = process.env.CHROME_DRIVER_PATH || chromedriver.path;

export class Scraper {
    private driver: ThenableWebDriver;

    constructor() {
        // setup
        let options = new Options();
        options.setChromeBinaryPath(CHROME_BINARY_PATH);
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.excludeSwitches("enable-logging");

        let serviceBuilder = new ServiceBuilder(CHROME_DRIVER_PATH);
        this.driver = new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .setChromeService(serviceBuilder)
            .build();
    }

    async getPageSource(): Promise<string> {
        let html: string = "";
        try {
            // Open up google.com in the browser
            await this.driver.get('https://www.google.com');
            // Wait on this page until this condition is met
            await this.driver.wait(until.titleMatches(/Google/));
            // Get the full HTML of the page and log it
            return this.driver.getPageSource();
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    /**
     * Get number of thumbnails from search of given search string. 
     * @param search search string to find large images of.
     * @param maxImages maximum number of thumbnails to return (or total on page)
     */
    async getThumbnailsForSearch(search: string, maxImages: number): Promise<string[]> {
        let url = "https://www.google.com/search?q=" + search + "&source=lnms&tbm=isch";
        try {
            // open page
            await this.driver.get(url);
            await this.driver.wait(until.titleContains("Google Search"));
            const images = await this.driver.findElements(By.className("rg_i"));
            const base64images = images.slice(0, maxImages).map(element => element.getAttribute("src"));
            return Promise.all(base64images);
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async quit() {
        await this.driver.quit();
    }
}
