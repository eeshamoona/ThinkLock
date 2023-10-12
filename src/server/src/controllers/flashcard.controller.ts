import dbPromise from "../utils/database";
import { Flashcard } from "../models/flashcard.model";

export async function getAllFlashcards(
  thinksession_id: number
): Promise<Flashcard[]> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM flashcard WHERE thinksession_id = ?`;
    const params = [thinksession_id];
    const res = await db.all<Flashcard[]>(query, params);
    return res;
  } catch (error) {
    return [];
  }
}
