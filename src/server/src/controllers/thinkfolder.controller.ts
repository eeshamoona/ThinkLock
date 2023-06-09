import dbPromise from "../utils/database";
import { ThinkFolder } from "../models/thinkfolder.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";

export async function getAllThinkFolders(): Promise<
  ThinkFolder[] | FailureResponse
> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM thinkfolder`;
    const res = await db.all<ThinkFolder[]>(query);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function getThinkFolderById(
  id: number
): Promise<ThinkFolder | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM thinkfolder WHERE id = ?`;
    const params = [id];
    const res = await db.get<ThinkFolder>(query, params);
    if (!res) {
      return new FailureResponse(404, `thinkfolder with id ${id} not found`);
    }
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createThinkFolder(
  thinkfolder: Partial<ThinkFolder>
): Promise<number | FailureResponse> {
  try {
    const db = await dbPromise;
    const query =
      "INSERT INTO thinkfolder (name, description, color) VALUES (?, ?, ?)";
    const params = [
      thinkfolder.name,
      thinkfolder.description,
      thinkfolder.color,
    ];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create thinkfolder");
    }
    return res.lastID;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}
