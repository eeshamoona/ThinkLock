import dbPromise from "../utils/database";
import { Database } from "sqlite";
import { FailureResponse } from "../utils/responses";

export async function getNotes(id: number): Promise<string | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT note FROM notesWidget WHERE id = ?`;
    const params = [id];
    const res = await db.get<string>(query, params);
    if (!res) {
      return new FailureResponse(404, `thinksession with id ${id} not found`);
    }
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createNotesWidget(
  think_folder_id: number
): Promise<number | FailureResponse> {
  try {
    const db = await dbPromise;
    const query =
      "INSERT INTO notesWidget (think_folder_id, note) VALUES (?, ?)";
    const params = [think_folder_id, ""];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create notes widget");
    }
    return res.lastID;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}
