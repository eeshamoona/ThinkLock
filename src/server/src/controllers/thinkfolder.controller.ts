import dbPromise from "../utils/database";
import { ThinkFolder } from "../models/thinkfolder.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";
import { Database } from "sqlite";

/**
 * getAllThinkFolders(): returns all thinkfolders
 * Use case: Showing all thinkfolders on the plan page
 * @param dbInstance [optional] - database instance to use
 * @returns List of thinkfolders or FailureResponse
 */
async function getAllThinkFolders(
  dbInstance?: Database,
): Promise<ThinkFolder[] | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const query = `SELECT * FROM thinkfolder`;
    const res = await db.all<ThinkFolder[]>(query);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

/**
 * getThinkFolderById(): returns thinkfolder with given id
 * Use case: Showing a specific thinkfolder on the plan page
 * @param id  - id of thinkfolder to return
 * @param dbInstance [optional] - database instance to use
 * @returns ThinkFolder or FailureResponse
 */
async function getThinkFolderById(
  id: number,
  dbInstance?: Database,
): Promise<ThinkFolder | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
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

/**
 * createThinkFolder(): creates a new thinkfolder
 * Use case: Creating a new thinkfolder
 * @param thinkfolder - thinkfolder information to create
 * @param dbInstance [optional] - database instance to use
 * @returns id of created thinkfolder or FailureResponse
 */
async function createThinkFolder(
  thinkfolder: Partial<ThinkFolder>,
  dbInstance?: Database,
): Promise<number | FailureResponse> {
  try {
    const db = dbInstance || (await dbPromise);
    const query =
      "INSERT INTO thinkfolder (name, description, color, icon) VALUES (?, ?, ?, ?)";
    const params = [
      thinkfolder.name,
      thinkfolder.description,
      thinkfolder.color,
      thinkfolder.icon,
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

export { getAllThinkFolders, getThinkFolderById, createThinkFolder };
