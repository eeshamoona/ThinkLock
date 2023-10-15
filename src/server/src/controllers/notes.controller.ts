import dbPromise from "../utils/database";
import { Database } from "sqlite";
import { FailureResponse, SuccessResponse } from "../utils/responses";
import { Notes } from "../models/notes.model";

export async function getNotes(
  thinksession_id: number,
  dbInstance?: Database,
): Promise<string | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);

    //check if thinksession exists
    const thinksessionQuery = `SELECT * FROM thinksession WHERE id = ?`;
    const thinksessionParams = [thinksession_id];
    const thinksessionRes = await db.get(thinksessionQuery, thinksessionParams);
    if (!thinksessionRes) {
      return new FailureResponse(404, "ThinkSession not found");
    }

    const query = `SELECT * FROM notes WHERE thinksession_id = ?`;
    const params = [thinksession_id];
    const res = await db.get<Notes>(query, params);
    if (!res) {
      return new FailureResponse(404, "Notes not found");
    }
    return res.content;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createNotes(
  thinksession_id: number,
  dbInstance?: Database,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);

    //check if thinksession exists
    const thinksessionQuery = `SELECT * FROM thinksession WHERE id = ?`;
    const thinksessionParams = [thinksession_id];
    const thinksessionRes = await db.get(thinksessionQuery, thinksessionParams);
    if (!thinksessionRes) {
      return new FailureResponse(404, "ThinkSession not found");
    }

    // check if notes already exists
    const findQuery = `SELECT * FROM notes WHERE thinksession_id = ?`;
    const findParams = [thinksession_id];
    const findRes = await db.get(findQuery, findParams);
    if (findRes) {
      return new SuccessResponse(201, `Notes exists already ${findRes.id}`);
    }

    const query = `INSERT INTO notes (thinksession_id, content) VALUES (?, ?)`;
    const params = [thinksession_id, ""];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create notes");
    }
    return new SuccessResponse(201, "Notes created with id " + res.lastID);
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function updateNotes(
  thinksession_id: number,
  content: string,
  dbInstance?: Database,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const query = `UPDATE notes SET content = ? WHERE thinksession_id = ?`;
    const params = [content, thinksession_id];
    const res = await db.run(query, params);
    if (res.changes === 0) {
      return new FailureResponse(500, "failed to update notes");
    }
    return new SuccessResponse(200, "notes updated");
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}
