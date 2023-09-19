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
