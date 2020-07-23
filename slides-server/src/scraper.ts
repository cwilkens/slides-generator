import { Browser, Builder, ThenableWebDriver, until } from 'selenium-webdriver';
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
            const res1 = await this.driver.get('https://www.google.com');
            // Wait on this page until this condition is met
            const res2 = await this.driver.wait(until.titleMatches(/Google/));
            // Get the full HTML of the page and log it
            return this.driver.getPageSource();
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    async quit() {
        await this.driver.quit();
    }
}
