export class SuccessResponse {
  status: number = 200;
  message: string = "Success";
  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export class FailureResponse {
  status: number = 500;
  error: string = "Error";
  constructor(status: number, error: string) {
    this.status = status;
    this.error = error;
  }
}
