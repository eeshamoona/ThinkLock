import dbPromise from "../utils/database";
import { ThinkSession } from "../models/thinksession.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";
import { HeatmapData } from "../models/heatmapdata.model";
import { Database } from "sqlite";

//TODO: Not used so remove or replace with a better useCase
/**
 * getAllThinkSessions(): returns all thinksessions
 * Use case: ...
 * @param dbInstance [optional] - database instance to use
 * @returns List of thinksessions or FailureResponse
 */
async function getAllThinkSessions(
  dbInstance?: Database,
): Promise<ThinkSession[] | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const query = `SELECT * FROM thinksession`;
    const res = await db.all<ThinkSession[]>(query);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

/**
 * getThinkSessionById(): returns thinksession with given id
 * Use case: Showing a specific thinksession on the study page
 * @param id  - id of thinksession to return
 * @param dbInstance [optional] - database instance to use
 * @returns ThinkSession or FailureResponse
 */
async function getThinkSessionById(
  id: number,
  dbInstance?: Database,
): Promise<ThinkSession | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
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

/**
 * createThinkSession(): creates a new thinksession
 * Use case: Creating a new thinksession
 * @param thinksession - thinksession information to create
 * @param dbInstance [optional] - database instance to use
 * @returns id of created thinksession or FailureResponse
 */
async function createThinkSession(
  thinksession: Partial<ThinkSession>,
  dbInstance?: Database,
): Promise<number | FailureResponse> {
  try {
    //Create a default layout for the thinksession
    const defaultLayout = {
      x: 0,
      y: 0,
      w: 3,
      h: 1,
      i: "add-widget",
      moved: false,
      static: false,
    };
    const db = dbInstance || (await dbPromise);
    const query =
      "INSERT INTO thinksession (thinkfolder_id, title, location, date, start_time, end_time, layout) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const params = [
      thinksession.thinkfolder_id,
      thinksession.title,
      thinksession.location,
      thinksession.date,
      thinksession.start_time,
      thinksession.end_time,
      JSON.stringify([defaultLayout]),
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

/**
 * getAllThinkSessionsByThinkFolderId(): returns all thinksessions with given thinkfolder_id
 * Use case: Showing all thinksessions for a specific thinkfolder on the thinkfolder details page
 * @param thinkfolder_id  - id of thinkfolder to return thinksessions for
 * @param dbInstance [optional] - database instance to use
 * @returns List of thinksessions or FailureResponse
 */
async function getAllThinkSessionsByThinkFolderId(
  thinkfolder_id: number,
  dbInstance?: Database,
): Promise<ThinkSession[] | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const query = `SELECT * FROM thinksession WHERE thinkfolder_id = ?`;
    const params = [thinkfolder_id];
    const res = await db.all<ThinkSession[]>(query, params);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

/**
 * getAllThinkSessionsByDate(): returns all thinksessions with given date
 * Use case: Showing all thinksessions for a specific date on the study page
 * @param date  - date of thinksession to return thinksessions for
 * @param dbInstance [optional] - database instance to use
 * @returns List of thinksessions or FailureResponse
 */
async function getAllThinkSessionsByDate(
  date: Date,
  dbInstance?: Database,
): Promise<ThinkSession[] | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const query = `SELECT * FROM thinksession WHERE date(date) = ?`;
    const params = [date.toISOString().slice(0, 10)];
    const res = await db.all<ThinkSession[]>(query, params);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

//TODO: Move this to thinkfolder.controller.ts
/**
 * getThinkSessionHeatMapByYear(): returns all thinksessions with given thinkfolder_id
 * Use case: Getting heatmap data for a specific thinkfolder
 * @param thinkfolder_id  - id of thinkfolder to return thinksessions for
 * @param dbInstance [optional] - database instance to use
 * @returns List of thinksessions or FailureResponse
 */
async function getThinkSessionHeatMapByYear(
  year: number,
  thinkfolder_id: number,
  dbInstance?: Database,
): Promise<HeatmapData[]> {
  const db = dbInstance || (await dbPromise);

  const startDate = `${year}-01-01T00:00:00.000Z`;
  const endDate = `${year}-12-31T23:59:59.999Z`;

  const query = `
  SELECT date, SUM(
    CAST(strftime('%s', end_time) AS REAL) - CAST(strftime('%s', start_time) AS REAL)
  ) / 3600 AS total_hours
  FROM thinksession
  WHERE thinkfolder_id = ? 
    AND date BETWEEN ? AND ?
  GROUP BY date`;

  const params = [thinkfolder_id, startDate, endDate];
  const rows = await db.all<HeatmapData[]>(query, params);

  return rows;
}

/**
 * updateThinkSession(): updates thinksession with given id
 * Use case: Updating a specific thinksession
 * @param id - id of thinksession to update
 * @param request - updated thinksession information
 * @param dbInstance [optional] - database instance to use
 * @returns SuccessResponse or FailureResponse
 */
async function updateThinkSession(
  id: number,
  request: Partial<ThinkSession>,
  dbInstance?: Database,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const {
      thinkfolder_id,
      title,
      location,
      date,
      start_time,
      end_time,
      layout,
    } = request;
    const params = [];
    let query = "UPDATE thinksession SET ";

    if (thinkfolder_id !== undefined) {
      query += "thinkfolder_id = ?, ";
      params.push(thinkfolder_id);
    }

    if (title !== undefined) {
      query += "title = ?, ";
      params.push(title);
    }

    if (location !== undefined) {
      query += "location = ?, ";
      params.push(location);
    }

    if (date !== undefined) {
      query += "date = ?, ";
      params.push(date);
    }

    if (start_time !== undefined) {
      query += "start_time = ?, ";
      params.push(start_time);
    }

    if (end_time !== undefined) {
      query += "end_time = ?, ";
      params.push(end_time);
    }

    if (layout !== undefined) {
      query += "layout = ?, ";
      params.push(layout);
    }

    query = query.slice(0, -2);

    query += " WHERE id = ?";
    params.push(id);

    await db.run(query, params);

    return new SuccessResponse(200, `thinksession ${id} updated`);
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export {
  getAllThinkSessions,
  getThinkSessionById,
  createThinkSession,
  getAllThinkSessionsByThinkFolderId,
  getAllThinkSessionsByDate,
  getThinkSessionHeatMapByYear,
  updateThinkSession,
};
