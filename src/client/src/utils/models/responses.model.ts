export interface SuccessResponse {
  status: number;
  message: string;
}

export interface FailureResponse {
  status: number;
  error: string;
}

export class FailureResponse {
  constructor(
    public status: number,
    public error: string
  ) {}
}

export class SuccessResponse {
  constructor(
    public statusCode: number,
    public message: string
  ) {}
}
