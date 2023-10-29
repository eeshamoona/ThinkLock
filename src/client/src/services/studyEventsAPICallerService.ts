import axios from "axios";
import {
  FailureResponse,
  SuccessResponse,
} from "../utils/models/responses.model";
import { StudyEvent } from "../utils/models/studyevent.model";

const API_URL = "http://localhost:3000/studyevents";

export async function getAllStudyEventsFromThinkSession(
  thinkSessionId: number,
): Promise<StudyEvent[] | FailureResponse> {
  try {
    const response = await axios.get(`${API_URL}/all/${thinkSessionId}`);
    return response.data.studyEvents;
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

export async function addStudyEventToThinkSession(
  thinkSessionId: number,
  studyEvent: Partial<StudyEvent>,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/add/${thinkSessionId}`,
      studyEvent,
    );
    return response.data.message;
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
