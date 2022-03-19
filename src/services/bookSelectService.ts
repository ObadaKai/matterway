import { Page } from "puppeteer";
import Constants from "../utils/constants";

export default class BookSelectService {
  private static _instance: BookSelectService;
  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new BookSelectService();
    return this._instance;
  }

  async process(page: Page) {
    // First step is to pick the book by the user
    if (page.url() === Constants.GoodReadsBestBooks2020Url) return;

    // A modal always opens first time visiting the site when opening a new page (a click outside closes it)
    await this.hideModal(page);

    // Pick a random book
    if (page.url().includes("choiceawards")) return this.pickRandomBook(page);

    // After picking a random book get the title of it and return it
    if (page.url().includes("book/show")) return (await this.getBookTitle(page)).replace("\n", "").trim();
  }

  async hideModal(page: Page) {
    const pageModalSelector = ".modalOpened";
    const pageModal = await page.$(pageModalSelector);
    if (pageModal) await page.mouse.click(1, 1, { button: "left" });
  }

  async pickRandomBook(page: Page) {
    const bookItemSelector = ".pollAnswer";
    await page.waitForSelector(bookItemSelector);
    const bookItems = await page.$$(bookItemSelector);
    await bookItems[Math.floor(Math.random() * 10)].click();
    return undefined;
  }

  async getBookTitle(page: Page): Promise<string> {
    const bookTitleSelector1 = ".BookPageTitleSection__title .Text__title1";
    const bookTitleSelector2 = "#bookTitle";

    let bootTitleElement = await page.$(bookTitleSelector1);
    if (!bootTitleElement) bootTitleElement = await page.$(bookTitleSelector2);
    return bootTitleElement?.evaluate((x) => x.textContent, bootTitleElement);
  }
}
