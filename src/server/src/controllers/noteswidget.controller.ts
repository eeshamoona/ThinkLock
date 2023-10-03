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
  thinksession_id: number
): Promise<number | FailureResponse> {
  try {
    const db = await dbPromise;

    // Check if a notesWidget already exists for the given thinksession_id
    const notesWidgetQuery =
      "SELECT * FROM notesWidget WHERE thinksession_id = ?";
    const notesWidgetParams = [thinksession_id];
    const notesWidgetRes = await db.get(notesWidgetQuery, notesWidgetParams);
    if (notesWidgetRes) {
      return notesWidgetRes.id;
    }

    // Create a new notesWidget
    const query =
      "INSERT INTO notesWidget (thinksession_id, note) VALUES (?, ?)";
    const params = [thinksession_id, ""];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "Failed to create notes widget");
    }
    return res.lastID;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function updateNotesWidget(
  id: number,
  note: string
): Promise<string | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `UPDATE notesWidget SET note = ? WHERE id = ?`;
    const params = [note, id];
    const res = await db.run(query, params);
    if (!res.changes) {
      return new FailureResponse(500, "failed to update notes widget");
    }
    return note;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function deleteNotesWidget(
  id: number
): Promise<string | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `DELETE FROM notesWidget WHERE id = ?`;
    const params = [id];
    const res = await db.run(query, params);
    if (!res.changes) {
      return new FailureResponse(500, "failed to delete notes widget");
    }
    return "success";
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}
