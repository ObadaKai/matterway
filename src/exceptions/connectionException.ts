export default class ConnectionException extends Error {
  constructor(message = "A Connection error occured please try again later") {
    super(message);
  }
}
