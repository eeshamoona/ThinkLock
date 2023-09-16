import axios from "axios";
import { ThinkSession } from "../utils/models/thinksession.model";

export async function addThinkSession(
  thinkSession: Pick<
    ThinkSession,
    | "thinkfolder_id"
    | "title"
    | "description"
    | "date"
    | "start_time"
    | "end_time"
    | "duration"
  >
): Promise<number | string> {
  try {
    const response = await axios.post("/thinksessions/create", thinkSession);
    return response.data.thinksession_id;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllThinkSessions(): Promise<ThinkSession[] | string> {
  try {
    const response = await axios.get("/thinksessions/all");
    return response.data.thinksessions;
  } catch (err) {
    return `${err}`;
  }
}

export async function getThinkSessionById(
  thinkSessionId: number
): Promise<ThinkSession | string> {
  try {
    const response = await axios.get(`/thinksessions/${thinkSessionId}`);
    return response.data.thinksession;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllThinkSessionsByThinkFolderId(
  thinkFolderId: number
): Promise<ThinkSession[] | string> {
  try {
    const response = await axios.get(`/thinksessions/all/${thinkFolderId}`);
    return response.data.thinksessions;
  } catch (err) {
    return `${err}`;
  }
}
