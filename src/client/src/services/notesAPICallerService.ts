import axios from "axios";
import {
  FailureResponse,
  SuccessResponse,
} from "../utils/models/responses.model";
const API_URL = "http://localhost:3000/notes";

export async function getNotesByThinkSessionId(
  thinksession_id: number,
): Promise<string | FailureResponse> {
  try {
    const response = await axios.get(`${API_URL}/${thinksession_id}`);
    return response.data.notes;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error,
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function createNotesByThinkSessionId(
  thinksession_id: number,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const response = await axios.post(`${API_URL}/${thinksession_id}`);
    return new SuccessResponse(response.status, response.data.message);
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error,
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function updateNotesByThinkSessionId(
  thinksession_id: number,
  content: string,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const response = await axios.put(`${API_URL}/${thinksession_id}`, {
      content,
    });
    return new SuccessResponse(response.status, response.data.message);
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error,
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}
