import dbPromise from "../utils/database";
import { StudyEvent } from "../models/studyevent.model";
import { FailureResponse } from "../utils/responses";
import { Database } from "sqlite";
import { getThinkSessionById } from "./thinksession.controller";

/**
 * getAllStudyEventsFromThinkSession(): returns all studyevents from a thinksession
 * Use case: Showing all studyevents on the thinksession page
 * @param thinksession_id - id of thinksession to return studyevents from
 * @param dbInstance [optional] - database instance to use
 * @returns  List of studyevents or FailureResponse
 */
async function getAllStudyEventsFromThinkSession(
  thinksession_id: number,
  dbInstance?: Database
): Promise<StudyEvent[] | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);

    //check if thinksession exists
    const thinksessionRes = await getThinkSessionById(thinksession_id);
    if (thinksessionRes instanceof FailureResponse) {
      return new FailureResponse(404, "ThinkSession not found");
    }

    const query = `SELECT * FROM studyevents WHERE thinksession_id = ?
    ORDER BY timestamp ASC`;
    const params = [thinksession_id];
    const res = await db.all<StudyEvent[]>(query, params);
    return res;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

/**
 * addStudyEventToThinkSession(): creates a new studyevent
 * Use case: Creating a new studyevent if a user interacts with a widget
 * @param thinksession_id - id of thinksession to add studyevent to
 * @param event_type - type of event
 * @param details - details of event
 * @param reference_id - id of the widget that triggered the event
 * @param dbInstance [optional] - database instance to use
 * @returns StudyEvent object or FailureResponse
 */
async function addStudyEventToThinkSession(
  thinksession_id: number,
  studyevent: Partial<StudyEvent>,
  dbInstance?: Database
): Promise<StudyEvent | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const currentTimestamp = new Date();
    //check if thinksession exists
    const thinksessionRes = await getThinkSessionById(thinksession_id);
    if (thinksessionRes instanceof FailureResponse) {
      return new FailureResponse(404, "ThinkSession not found");
    }

    const query = `INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id)
    VALUES (?, ?, ?, ?, ?)`;
    const params = [
      thinksession_id,
      studyevent.event_type,
      currentTimestamp.toISOString(),
      studyevent.details,
      studyevent.reference_id,
    ];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create study event");
    }
    return {
      id: res.lastID,
      thinksession_id: thinksession_id,
      event_type: studyevent.event_type as string,
      timestamp: new Date(currentTimestamp.toISOString()),
      details: studyevent.details as string,
      reference_id: studyevent.reference_id,
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export { getAllStudyEventsFromThinkSession, addStudyEventToThinkSession };
