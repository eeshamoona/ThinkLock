import axios from "axios";
import { ThinkSession } from "../utils/models/thinksession.model";
import { getThinkFolderById } from "./thinkFolderAPICallerService";
import { HeatmapDataResponse } from "../utils/models/heatmapdata.model";

export const addThinkSession = async (
  thinkSession: Pick<
    ThinkSession,
    "thinkfolder_id" | "title" | "location" | "date" | "start_time" | "end_time"
  >
): Promise<number | string> =>
  axios
    .post("/thinksessions/create", thinkSession)
    .then((response) => response.data.thinksession_id)
    .catch((err) => `${err}`);

export const getAllThinkSessions = async (): Promise<ThinkSession[] | string> =>
  axios
    .get("/thinksessions/all")
    .then((response) => response.data.thinksessions)
    .catch((err) => `${err}`);

export const getThinkSessionHeatmapData = async (
  thinkFolderId: number,
  year: number
): Promise<HeatmapDataResponse | string> =>
  axios
    .get(`/heatmap/${thinkFolderId}/${year}`)
    .then((response) => response.data)
    .catch((err) => `${err}`);

export const getThinkSessionById = async (
  thinkSessionId: number
): Promise<ThinkSession | string> =>
  axios
    .get(`/thinksessions/${thinkSessionId}`)
    .then((response) => response.data.thinksession)
    .catch((err) => `${err}`);

export const getAllThinkSessionsByThinkFolderId = async (
  thinkFolderId: number
): Promise<ThinkSession[] | string> =>
  axios
    .get(`/thinksessions/all/${thinkFolderId}`)
    .then((response) => {
      const thinkSessions: ThinkSession[] = response.data.thinksessions;
      return thinkSessions.sort(
        (a, b) =>
          new Date(a.start_time).getUTCDate() -
          new Date(b.start_time).getUTCDate()
      );
    })
    .catch((err) => `${err}`);

export const getAllThinkSessionsByDate = async (
  date: Date
): Promise<ThinkSession[] | string> => {
  const response = await axios.get(`/thinksessions/all/date/${date}`);
  const thinkSessions: ThinkSession[] = response.data.thinksessions;
  const thinkSessionsWithFolderInfo: ThinkSession[] = await Promise.all(
    thinkSessions.map(async (thinkSession) => {
      const thinkFolder = await getThinkFolderById(thinkSession.thinkfolder_id);
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
    })
  );
  thinkSessionsWithFolderInfo.sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
  return thinkSessionsWithFolderInfo;
};
