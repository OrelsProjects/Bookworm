export class ErrorDeleteUserBook extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ErrorDeleteUserBook";
    }
  }