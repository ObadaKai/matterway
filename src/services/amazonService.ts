import { Page } from "puppeteer";
import Constants from "../utils/constants";

export default class AmazonService {
  private static _instance: AmazonService;
  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new AmazonService();
    return this._instance;
  }

  async process(page: Page, bookName: string) {
    // Search for the book on home page
    if (page.url() === `${Constants.AmzaonUrl}/`) return this.searchBookName(page, bookName);

    // Select the first item in the result list
    if (page.url().includes("s?k=")) return this.selectFirstItemInList(page);

    // Add the Item to the shopping list (please note that for some products other options might come up but i only covered the case where add to shopping list button shows up)
    if (page.url().includes("/dp/")) return this.addItemToShoppingList(page);

    // Click over Proceed to Checkout button
    if (page.url().includes("/cart")) return this.proceedToCheckout(page);
  }

  async searchBookName(page: Page, bookName: string) {
    const searchBoxInputSelector = "#twotabsearchtextbox";
    const searchBoxSubmitButtonSelector = "#nav-search-submit-button";

    const searchBoxInput = await page.$(searchBoxInputSelector);
    await searchBoxInput?.evaluate((el, value) => (el.value = value), bookName);
    const searchBoxSubmitButton = await page.$(searchBoxSubmitButtonSelector);
    await searchBoxSubmitButton?.click();
  }

  async selectFirstItemInList(page: Page) {
    const itemImageSelector = ".s-product-image-container>div>span>a";
    const itemImage = await page.$(itemImageSelector);
    return itemImage?.click();
  }

  async addItemToShoppingList(page: Page) {
    const buttonSelector = "#add-to-cart-button";
    const button = await page.$(buttonSelector);
    return button?.click();
  }

  async proceedToCheckout(page: Page) {
    const buttonSelector = "input[name='proceedToRetailCheckout']";
    const button = await page.$(buttonSelector);
    return button?.click();
  }
}
