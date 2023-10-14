import dbPromise from "../utils/database";
import { StudyEvent } from "../models/studyevent.model";
import { FailureResponse } from "../utils/responses";

export async function getAllStudyEventsFromThinkSession(
  thinksession_id: number,
): Promise<StudyEvent[]> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM studyevents WHERE thinksession_id = ?
    ORDER BY timestamp ASC`;
    const params = [thinksession_id];
    const res = await db.all<StudyEvent[]>(query, params);
    return res;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function addStudyEventToThinkSession(
  thinksession_id: number,
  event_type: string,
  details: string,
  reference_id: number,
): Promise<number | FailureResponse> {
  try {
    const db = await dbPromise;
    const currentTimestamp = new Date();
    const query = `INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id) VALUES (?, ?, ?, ?, ?)`;
    const params = [
      thinksession_id,
      event_type,
      currentTimestamp.toISOString(),
      details,
      reference_id,
    ];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create study event");
    }
    return res.lastID;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
