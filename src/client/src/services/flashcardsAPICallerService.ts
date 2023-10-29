import axios from "axios";
import {
  FailureResponse,
  SuccessResponse,
} from "../utils/models/responses.model";
import { Flashcard } from "../utils/models/flashcard.model";

const API_URL = "http://localhost:3000/flashcards";

export async function getAllFlashcardsByThinkSessionId(
  thinksession_id: number,
): Promise<Flashcard[] | FailureResponse> {
  try {
    const response = await axios.get(`${API_URL}/${thinksession_id}`);
    return response.data.flashcards;
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

export async function createFlashcardByThinkSessionId(
  thinksession_id: number,
  flashcardToCreate: Partial<Flashcard>,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/${thinksession_id}`,
      flashcardToCreate,
    );
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

export async function deleteFlashcardById(
  flashcard_id: number,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const response = await axios.delete(`${API_URL}/${flashcard_id}`);
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

export async function updateFlashcardById(
  flashcard_id: number,
  flashcardToUpdate: Partial<Flashcard>,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const response = await axios.put(
      `${API_URL}/${flashcard_id}`,
      flashcardToUpdate,
    );
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
