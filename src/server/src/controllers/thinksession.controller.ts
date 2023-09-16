import dbPromise from "../utils/database";
import { ThinkSession } from "../models/thinksession.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";

export async function getAllThinkSessions(): Promise<
  ThinkSession[] | FailureResponse
> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM thinksession`;
    const res = await db.all<ThinkSession[]>(query);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function getThinkSessionById(
  id: number
): Promise<ThinkSession | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM thinksession WHERE id = ?`;
    const params = [id];
    const res = await db.get<ThinkSession>(query, params);
    if (!res) {
      return new FailureResponse(404, `thinksession with id ${id} not found`);
    }
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createThinkSession(
  thinksession: Partial<ThinkSession>
): Promise<number | FailureResponse> {
  try {
    const db = await dbPromise;
    const query =
      "INSERT INTO thinksession (thinkfolder_id, title, description, date, start_time, end_time, duration) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const params = [
      thinksession.thinkfolder_id,
      thinksession.title,
      thinksession.description,
      thinksession.date,
      thinksession.start_time,
      thinksession.end_time,
      thinksession.duration,
    ];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create thinksession");
    }
    return res.lastID;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function getAllThinkSessionsByThinkFolderId(
  thinkfolder_id: number
): Promise<ThinkSession[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM thinksession WHERE thinkfolder_id = ?`;
    const params = [thinkfolder_id];
    const res = await db.all<ThinkSession[]>(query, params);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}
