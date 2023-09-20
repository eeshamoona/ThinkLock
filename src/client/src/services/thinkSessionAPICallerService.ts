import axios from "axios";
import { ThinkSession } from "../utils/models/thinksession.model";
import { getThinkFolderById } from "./thinkFolderAPICallerService";

export async function addThinkSession(
  thinkSession: Pick<
    ThinkSession,
    "thinkfolder_id" | "title" | "location" | "date" | "start_time" | "end_time"
  >,
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
  thinkSessionId: number,
): Promise<ThinkSession | string> {
  try {
    const response = await axios.get(`/thinksessions/${thinkSessionId}`);
    return response.data.thinksession;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllThinkSessionsByThinkFolderId(
  thinkFolderId: number,
): Promise<ThinkSession[] | string> {
  try {
    const response = await axios.get(`/thinksessions/all/${thinkFolderId}`);
    return response.data.thinksessions;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllThinkSessionsByDate(
  date: Date,
): Promise<ThinkSession[] | string> {
  try {
    const response = await axios.get(`/thinksessions/all/date/${date}`);
    const thinkSessions: ThinkSession[] = response.data.thinksessions;
    const thinkSessionsWithFolderInfo: ThinkSession[] = await Promise.all(
      thinkSessions.map(async (thinkSession) => {
        const thinkFolder = await getThinkFolderById(
          thinkSession.thinkfolder_id,
        );
        if (typeof thinkFolder === "string")
          return {
            ...thinkSession,
            thinkfolder_color: "",
            thinkfolder_icon: "",
          };
        return {
          ...thinkSession,
          thinkfolder_color: thinkFolder.color,
          thinkfolder_icon: thinkFolder.icon,
        };
      }),
    );
    return thinkSessionsWithFolderInfo;
  } catch (err) {
    return `${err}`;
  }
}
