import dbPromise from "../utils/database";
import { ActionItem } from "../models/actionitem.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";
import { Database } from "sqlite";
import { ThinkFolder } from "../models/thinkfolder.model";
import { ThinkSession } from "../models/thinksession.model";
import { getThinkSessionById } from "./thinksession.controller";

export async function getActionItemById(
  id: number,
  dbInstance?: Database,
): Promise<ActionItem | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const query = `SELECT * FROM actionitem WHERE id = ?`;
    const params = [id];
    const res = await db.get<ActionItem>(query, params);
    if (!res) {
      return new FailureResponse(404, `ActionItem ${id} not found`);
    }
    return res as ActionItem;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createActionItem(
  thinksession_id: number | null,
  thinkfolder_id: number,
  description: string,
  title: string,
  dbInstance?: Database,
): Promise<number | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const query =
      "INSERT INTO actionitem (thinksession_id, thinkfolder_id, title, description) VALUES (?, ?, ?, ?)";
    const params = [thinksession_id, thinkfolder_id, description, title];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create action item");
    }

    //Add a study event for the creation of this action item
    const studyEventQuery =
      "INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id) VALUES (?, ?, ?, ?, ?)";
    const currentTimestamp = new Date();
    const studyEventParams = [
      thinksession_id,
      "actionitem_created",
      currentTimestamp.toISOString(),
      `${title}`,
      res.lastID,
    ];
    const studyEvent = await db.run(studyEventQuery, studyEventParams);
    if (!studyEvent.lastID) {
      return new FailureResponse(500, "failed to create study event");
    }

    return res.lastID;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function getAllActionItemsByThinkFolderId(
  thinkfolder_id: number,
  dbInstance?: Database,
): Promise<ActionItem[] | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    // check if thinkfolder exists
    const thinkfolderQuery = `SELECT * FROM thinkfolder WHERE id = ?`;
    const thinkfolderParams = [thinkfolder_id];
    const thinkfolderRes = await db.get<ThinkFolder>(
      thinkfolderQuery,
      thinkfolderParams,
    );
    if (!thinkfolderRes) {
      return new FailureResponse(404, "ThinkFolder not found");
    }
    const query = `SELECT * FROM actionitem WHERE thinkfolder_id = ?`;
    const params = [thinkfolder_id];
    const res = await db.all<ActionItem[]>(query, params);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function getAllActionItemsByThinkSessionId(
  thinksession_id: number,
  dbInstance?: Database,
): Promise<ActionItem[] | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    // check if thinksession exists
    const thinksessionQuery = `SELECT * FROM thinksession WHERE id = ?`;
    const thinksessionParams = [thinksession_id];
    const thinksessionRes = await db.get<ThinkSession>(
      thinksessionQuery,
      thinksessionParams,
    );
    if (!thinksessionRes) {
      return new FailureResponse(404, "ThinkSession not found");
    }
    const query = `SELECT * FROM actionitem WHERE thinksession_id = ?`;
    const params = [thinksession_id];
    const res = await db.all<ActionItem[]>(query, params);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function updateActionItem(
  id: number,
  request: Partial<ActionItem>,
  dbInstance?: Database,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const { thinksession_id, thinkfolder_id, description, title } = request;
    const params = [];
    let query = "UPDATE actionitem SET ";

    if (thinksession_id !== undefined) {
      query += "thinksession_id = ?, ";
      params.push(thinksession_id);
    }

    if (thinkfolder_id !== undefined) {
      query += "thinkfolder_id = ?, ";
      params.push(thinkfolder_id);
    }

    if (description !== undefined) {
      query += "description = ?, ";
      params.push(description);
    }

    if (title !== undefined) {
      query += "title = ?, ";
      params.push(title);
    }

    // Remove the trailing comma and space from the query string
    query = query.slice(0, -2);

    query += " WHERE id = ?";
    params.push(id);

    await db.run(query, params);
    return new SuccessResponse(200, `Action item with id ${id} updated`);
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function toggleCompletedActionItem(
  id: number,
  dbInstance?: Database,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    //Get the action item
    const actionItem = await getActionItemById(id);
    if (actionItem instanceof FailureResponse) {
      return new FailureResponse(500, `${actionItem.error}`);
    }
    //Flip the completed flag
    const query = `UPDATE actionitem SET completed = ? WHERE id = ?`;
    const params = [!actionItem.completed, id];
    await db.run(query, params);

    //Add a study event wheter the action item was completed or uncompleted
    const studyEventQuery =
      "INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id) VALUES (?, ?, ?, ?, ?)";
    const currentTimestamp = new Date();
    const studyEventParams = [
      actionItem.thinksession_id,
      actionItem.completed ? "actionitem_unfinished" : "actionitem_completed",
      currentTimestamp.toISOString(),
      `${actionItem.description}`,
      id,
    ];
    const studyEvent = await db.run(studyEventQuery, studyEventParams);
    if (!studyEvent.lastID) {
      return new FailureResponse(500, "failed to create study event");
    }
    return new SuccessResponse(200, `Action item with id ${id} completed`);
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}
