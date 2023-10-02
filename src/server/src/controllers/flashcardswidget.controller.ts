import dbPromise from "../utils/database";
import { Database } from "sqlite";
import { FailureResponse } from "../utils/responses";
import { Flashcards } from "../models/flashcards.model";

export async function getFlashcards(
  id: number
): Promise<Flashcards | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM flashcards WHERE id = ?`;
    const params = [id];
    const res = await db.get<Flashcards>(query, params);
    if (!res) {
      return new FailureResponse(404, `thinksession with id ${id} not found`);
    }
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createFlashcardsWidget(
  think_folder_id: number
): Promise<number | FailureResponse> {
  try {
    const db = await dbPromise;
    const query =
      "INSERT INTO flashcards (think_folder_id, flashcards) VALUES (?, ?)";
    const params = [think_folder_id, ""];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create flashcards widget");
    }
    return res.lastID;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}
