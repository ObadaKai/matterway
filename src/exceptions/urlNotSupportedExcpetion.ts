export default class UrlNotSupportedExcpetion extends Error {
  constructor(message = "This Url is not supported") {
    super(message);
  }
}
