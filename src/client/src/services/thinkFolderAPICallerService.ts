import axios from "axios";
import { ThinkFolder } from "../utils/models/thinkfolder.model";

export async function addThinkFolder(
  thinkFolder: Pick<ThinkFolder, "name" | "description" | "color">,
): Promise<number | string> {
  try {
    const response = await axios.post("/thinkfolders/create", thinkFolder);
    return response.data.thinkfolder_id;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllThinkFolders(): Promise<ThinkFolder[] | string> {
  try {
    const response = await axios.get("/thinkfolders/all");
    return response.data.thinkfolders;
  } catch (err) {
    return `${err}`;
  }
}

export async function getThinkFolderById(
  thinkFolderId: number,
): Promise<ThinkFolder | string> {
  try {
    const response = await axios.get(`/thinkfolders/${thinkFolderId}`);
    return response.data.thinkfolder;
  } catch (err) {
    return `${err}`;
  }
}
