import dbPromise from "../utils/database";
import { Flashcard } from "../models/flashcard.model";
import { Database } from "sqlite";
import { FailureResponse, SuccessResponse } from "../utils/responses";
import { ThinkFolder } from "../models/thinkfolder.model";

export async function getAllFlashcards(
  thinksession_id: number,
  dbInstance?: Database,
): Promise<Flashcard[] | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const query = `SELECT * FROM flashcard WHERE thinksession_id = ?`;
    const params = [thinksession_id];
    const res = await db.all<Flashcard[]>(query, params);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createFlashcard(
  flashcard: Partial<Flashcard>,
  dbInstance?: Database,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);

    //check if thinksession exists
    const thinksessionQuery = `SELECT * FROM thinksession WHERE id = ?`;
    const thinksessionParams = [flashcard.thinksession_id];
    const thinksessionRes = await db.get(thinksessionQuery, thinksessionParams);
    if (!thinksessionRes) {
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
      flashcard.thinksession_id,
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

export async function deleteFlashcard(
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
