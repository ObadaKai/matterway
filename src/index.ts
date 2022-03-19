import express from "express";
import PuppeteerService from "./services/puppeteerService";
const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  await new PuppeteerService().processPickingCategory();
  res.status(200).send();
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
