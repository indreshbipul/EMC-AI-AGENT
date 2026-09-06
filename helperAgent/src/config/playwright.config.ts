import { chromium, type Browser, type Page } from "playwright";

let browser: Browser | null = null;
let page: Page | null = null;
let consoleErrors = [];
let pageErrors = [];

export const getBrowser = async (): Promise<Browser> => {
    if (browser) {
        return browser;
    }
    browser = await chromium.launch({headless: false});
    return browser;
};

export const getPage = async (): Promise<Page> => {
    if (page) {
        return page;
    }
    const browser = await getBrowser();
    page = await browser.newPage();
    return page;
};