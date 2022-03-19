export class Utils {
  static setTimeoutPromise(timeInMSec = 3000) {
    return new Promise((res) => {
      setTimeout(() => res, timeInMSec);
    });
  }
}
