import dbPromise from "../utils/database";
import { Database } from "sqlite";
import { FailureResponse } from "../utils/responses";
import { Flashcards } from "../models/flashcards.model";

export async function getFlashcards(
  id: number
): Promise<any[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT flashcards FROM flashcardsWidget WHERE id = ?`;
    const params = [id];
    const res = await db.get<Flashcards>(query, params);
    if (!res) {
      return new FailureResponse(404, `flashcards with id ${id} not found`);
    }
    return res.flashcards;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createFlashcardsWidget(
  thinksession_id: number
): Promise<number | FailureResponse> {
  try {
    const db = await dbPromise;

    // Check if a flashcards widget already exists for the given thinksession_id
    const flashcardsQuery =
      "SELECT * FROM flashcardsWidget WHERE thinksession_id = ?";
    const flashcardsParams = [thinksession_id];
    const flashcardsRes = await db.get<Flashcards>(
      flashcardsQuery,
      flashcardsParams
    );
    if (flashcardsRes) {
      return flashcardsRes.id;
    }

    const query =
      "INSERT INTO flashcardsWidget (thinksession_id, flashcards) VALUES (?, ?)";
    const params = [
      thinksession_id,
      JSON.stringify([{ front: "", back: "", id: 0 }]),
    ];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create flashcards widget");
    }
    return res.lastID;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function updateFlashcardsWidget(
  id: number,
  flashcards: string
): Promise<string | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `UPDATE flashcardsWidget SET flashcards = ? WHERE id = ?`;
    const params = [flashcards, id];
    const res = await db.run(query, params);
    if (!res.changes) {
      return new FailureResponse(500, "failed to update flashcards widget");
    }
    return flashcards;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function deleteFlashcardsWidget(
  id: number
): Promise<string | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `DELETE FROM flashcardsWidget WHERE id = ?`;
    const params = [id];
    const res = await db.run(query, params);
    if (!res.changes) {
      return new FailureResponse(500, "failed to delete flashcards widget");
    }
    return "success";
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}
