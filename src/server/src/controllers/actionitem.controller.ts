import dbPromise from "../utils/database";
import { ActionItem } from "../models/actionitem.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";
import e from "express";

export async function getAllActionItems(): Promise<
  ActionItem[] | FailureResponse
> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM actionitem`;
    const res = await db.all<ActionItem[]>(query);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function getActionItemById(
  id: number
): Promise<ActionItem | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM actionitem WHERE id = ?`;
    const params = [id];
    const res = await db.get<ActionItem>(query, params);
    if (!res) {
      return new FailureResponse(404, `action item with id ${id} not found`);
    }
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createActionItem(
  thinksession_id: number | null,
  thinkfolder_id: number,
  description: string,
  title: string
): Promise<number | FailureResponse> {
  try {
    const db = await dbPromise;
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
  thinkfolder_id: string
): Promise<ActionItem[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM actionitem WHERE thinkfolder_id = ?`;
    const params = [thinkfolder_id];
    const res = await db.all<ActionItem[]>(query, params);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function getAllActionItemsByThinkSessionId(
  thinksession_id: string
): Promise<ActionItem[] | FailureResponse> {
  try {
    const db = await dbPromise;
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
  request: Partial<ActionItem>
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = await dbPromise;
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
  id: number
): Promise<SuccessResponse | FailureResponse> {
  try {
    const db = await dbPromise;
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
      `${actionItem.title}`,
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
