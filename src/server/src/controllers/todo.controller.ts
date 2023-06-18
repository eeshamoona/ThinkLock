import dbPromise from "../utils/database";
import { Todo } from "../models/todo.model";
import { SuccessResponse, FailureResponse } from "../utils/responses";

export async function getAllTodos(): Promise<Todo[] | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM todo`;
    const res = await db.all<Todo[]>(query);
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function getTodoById(id: number): Promise<Todo | FailureResponse> {
  try {
    const db = await dbPromise;
    const query = `SELECT * FROM todo WHERE id = ?`;
    const params = [id];
    const res = await db.get<Todo>(query, params);
    if (!res) {
      return new FailureResponse(404, `todo with id ${id} not found`);
    }
    return res;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}

export async function createTodo(
  thinksession_id: number | null,
  thinkfolder_id: number,
  description: string
): Promise<number | FailureResponse> {
  try {
    const db = await dbPromise;
    const query =
      "INSERT INTO todo (thinksession_id, thinkfolder_id, description) VALUES (?, ?, ?)";
    const params = [thinksession_id, thinkfolder_id, description];
    const res = await db.run(query, params);
    if (!res.lastID) {
      return new FailureResponse(500, "failed to create todo");
    }
    return res.lastID;
  } catch (error) {
    return new FailureResponse(500, `${error}`);
  }
}
