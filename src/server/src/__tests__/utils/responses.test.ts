import { SuccessResponse, FailureResponse } from "../../utils/responses";
import { describe, it, expect, jest } from "@jest/globals";

describe("SuccessResponse", () => {
  class SuccessResponse {
    status: number;
    message: string;
    constructor(status: number = 200, message: string = "Success") {
      this.status = status;
      this.message = message;
    }
  }

  it("should create a success response with default values", () => {
    const response = new SuccessResponse();
    expect(response.status).toBe(200);
    expect(response.message).toBe("Success");
  });

  it("should create a success response with custom values", () => {
    const response = new SuccessResponse(201, "Created");
    expect(response.status).toBe(201);
    expect(response.message).toBe("Created");
  });
});

describe("FailureResponse", () => {
  class FailureResponse {
    status: number = 500;
    error: string = "Error";
    constructor(status: number = 500, error: string = "Error") {
      this.status = status;
      this.error = error;
    }
  }

  it("should create a failure response with custom values", () => {
    const response = new FailureResponse(404, "Not Found");
    expect(response.status).toBe(404);
    expect(response.error).toBe("Not Found");
  });
});
