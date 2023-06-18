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
