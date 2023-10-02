import dbPromise from "../utils/database";
import { ThinkSession } from "../models/thinksession.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";
import { HeatmapData } from "../models/heatmapdata.model";

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
      "INSERT INTO thinksession (thinkfolder_id, title, location, date, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)";
    const params = [
      thinksession.thinkfolder_id,
      thinksession.title,
      thinksession.location,
      thinksession.date,
      thinksession.start_time,
      thinksession.end_time,
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

export async function getAllThinkSessionsByDate(
  date: Date
): Promise<ThinkSession[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM thinksession WHERE date(date) = ?`;
    const params = [date.toISOString().slice(0, 10)];
    const res = await db.all<ThinkSession[]>(query, params);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function getThinkSessionHeatMapByYear(
  year: number,
  thinkfolder_id: number
): Promise<HeatmapData[]> {
  const db = await dbPromise;

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

export async function updateThinkSession(
  id: number,
  request: Partial<ThinkSession>
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = await dbPromise;
    const {
      thinkfolder_id,
      title,
      location,
      date,
      start_time,
      end_time,
      duration,
      notes,
      summary,
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

    if (duration !== undefined) {
      query += "duration = ?, ";
      params.push(duration);
    }

    if (notes !== undefined) {
      query += "notes = ?, ";
      params.push(notes);
    }

    if (summary !== undefined) {
      query += "summary = ?, ";
      params.push(summary);
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
