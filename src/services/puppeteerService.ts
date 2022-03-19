import puppeteer, { Page, Target } from "puppeteer";
import ConnectionException from "../exceptions/connectionException";
import UrlNotSupportedExcpetion from "../exceptions/urlNotSupportedExcpetion";
import Constants from "../utils/constants";
import { Utils } from "../utils/utils";
import AmazonService from "./amazonService";
import BookSelectService from "./bookSelectService";

export default class PuppeteerService {
  private bookSelectService = BookSelectService.getInstance();
  private amazonService = AmazonService.getInstance();
  private selectedBookName: string | undefined;

  async processPickingCategory(retryCount = 0): Promise<void> {
    try {
      const browser = await puppeteer.launch({ headless: false });
      let page: Page = await browser.newPage();
      await page.goto(Constants.GoodReadsBestBooks2020Url, { waitUntil: "networkidle0" });
      browser.on("targetchanged", async (event: Target) => {
        const newPage = await event.page();
        await new Promise((res) => newPage?.on("load", res));
        if (!newPage) return;
        page = newPage;
        await this.processOnPageChange(page);
      });
    } catch (err: any) {
      if (err instanceof UrlNotSupportedExcpetion || err instanceof ConnectionException) throw err;
      if (retryCount <= 2) {
        await Utils.setTimeoutPromise();
        return this.processPickingCategory(retryCount + 1);
      } else throw new ConnectionException();
    }
  }

  async processOnPageChange(page: Page) {
    const pageUrl = page.url();
    if (!this.selectedBookName && pageUrl.includes(Constants.GoodReadsUrl)) {
      const bookName = await this.bookSelectService.process(page);
      if (!bookName) return;
      this.selectedBookName = bookName;
      return page.goto(`${Constants.AmzaonUrl}`, { waitUntil: "networkidle0" });
    }
    if (this.selectedBookName && pageUrl.includes(Constants.AmzaonUrl)) return this.amazonService.process(page, this.selectedBookName);
    if (!pageUrl.includes(Constants.AmzaonUrl) && !pageUrl.includes(Constants.GoodReadsUrl)) throw new UrlNotSupportedExcpetion();
  }
}
