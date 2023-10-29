import dbPromise from "../utils/database";
import { Flashcard } from "../models/flashcard.model";
import { Database } from "sqlite";
import { FailureResponse, SuccessResponse } from "../utils/responses";
import { ThinkFolder } from "../models/thinkfolder.model";
import { getThinkSessionById } from "./thinksession.controller";

/**
 * getAllFlashcards(): returns all flashcards for a given thinksession
 * Use case: Showing flashcards on the study page
 * @param thinksession_id - id of thinksession to return flashcards from
 * @param dbInstance [optional] - database instance to use
 * @returns List of Flashcards or FailureResponse
 */
async function getAllFlashcards(
  thinksession_id: number,
  dbInstance?: Database,
): Promise<Flashcard[] | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    //check if thinksession exists
    const thinkSession = await getThinkSessionById(thinksession_id);
    if (thinkSession instanceof FailureResponse) {
      return new FailureResponse(404, "ThinkSession not found");
    }
    const query = `SELECT * FROM flashcard WHERE thinksession_id = ?`;
    const params = [thinksession_id];
    const res = await db.all<Flashcard[]>(query, params);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

/**
 * createFlashcard(): creates a new flashcard
 * Use case: Creating a new flashcard
 * @param thinksession_id - id of thinksession to create flashcard for
 * @param flashcard - flashcard information to create
 * @param dbInstance [optional] - database instance to use
 * @returns SuccessResponse with id of created flashcard or FailureResponse
 */
async function createFlashcard(
  thinksession_id: number,
  flashcard: Partial<Flashcard>,
  dbInstance?: Database,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);

    //check if thinksession exists
    const thinksessionRes = await getThinkSessionById(thinksession_id);
    if (thinksessionRes instanceof FailureResponse) {
      return new FailureResponse(404, "ThinkSession not found");
    }

    //get thinkfolder_id from thinksession
    const thinkfolderQuery = `SELECT * FROM thinkfolder WHERE id = ?`;
    const thinkfolderParams = [thinksessionRes.thinkfolder_id];
    const thinkfolderRes = await db.get<ThinkFolder>(
      thinkfolderQuery,
      thinkfolderParams,
    );
    if (!thinkfolderRes) {
      return new FailureResponse(404, "ThinkFolder not found");
    }

    const query = `INSERT INTO flashcard (thinksession_id, thinkfolder_id, front, back) VALUES (?, ?, ?, ?)`;
    const params = [
      thinksession_id,
      thinkfolderRes.id,
      flashcard.front,
      flashcard.back,
    ];
    const res = await db.run(query, params);
    return new SuccessResponse(201, `Flashcard created with id ${res.lastID}`);
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

/**
 * deleteFlashcard(): deletes a flashcard
 * Use case: Deleting a flashcard
 * @param flashcard_id - id of flashcard to delete
 * @param dbInstance [optional] - database instance to use
 * @returns SuccessResponse or FailureResponse
 */
async function deleteFlashcard(
  flashcard_id: number,
  dbInstance?: Database,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);

    //check if flashcard exists
    const flashcardQuery = `SELECT * FROM flashcard WHERE id = ?`;
    const flashcardParams = [flashcard_id];
    const flashcardRes = await db.get(flashcardQuery, flashcardParams);
    if (!flashcardRes) {
      return new FailureResponse(404, "Flashcard not found");
    }

    const query = `DELETE FROM flashcard WHERE id = ?`;
    const params = [flashcard_id];
    const res = await db.run(query, params);
    return new SuccessResponse(
      200,
      `Flashcard deleted with id ${flashcard_id}`,
    );
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

/**
 * updateFlashcard(): updates a flashcard
 * Use case: Updating a flashcard
 * @param flashcard_id - id of flashcard to update
 * @param flashcard - new flashcard information
 * @param dbInstance [optional] - database instance to use
 * @returns SuccessResponse or FailureResponse
 */

async function updateFlashcard(
  flashcard_id: number,
  flashcard: Partial<Flashcard>,
  dbInstance?: Database,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);

    //check if flashcard exists
    const flashcardQuery = `SELECT * FROM flashcard WHERE id = ?`;
    const flashcardParams = [flashcard_id];
    const flashcardRes = await db.get(flashcardQuery, flashcardParams);
    if (!flashcardRes) {
      return new FailureResponse(404, "Flashcard not found");
    }

    const query = `UPDATE flashcard SET front = ?, back = ? WHERE id = ?`;
    const params = [
      flashcard.front as string,
      flashcard.back as string,
      flashcard_id,
    ];
    const res = await db.run(query, params);
    if (res.changes === 0) {
      return new FailureResponse(500, "failed to update notes");
    }
    return new SuccessResponse(
      200,
      "Flashcard updated with id " + flashcard_id,
    );
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export { getAllFlashcards, createFlashcard, deleteFlashcard, updateFlashcard };
