import dbPromise from "../utils/database";
import { ActionItem } from "../models/actionitem.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";

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
