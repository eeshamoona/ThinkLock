import axios from "axios";
import { FailureResponse } from "../utils/models/responses.model";
import { ThinkFolder } from "../utils/models/thinkfolder.model";

const API_URL = "http://localhost:3000/thinkfolders";

export async function getAllThinkFolders(): Promise<
  ThinkFolder[] | FailureResponse
> {
  try {
    const response = await axios.get(`${API_URL}/all`);
    console.log("HELLOOO", response);
    return response.data.thinkfolders;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function getThinkFolderById(
  id: number
): Promise<ThinkFolder | FailureResponse> {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.thinkfolder;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function createThinkFolder(
  thinkFolder: ThinkFolder
): Promise<ThinkFolder | FailureResponse> {
  try {
    const response = await axios.post(`${API_URL}/create`, thinkFolder);
    return response.data.thinkfolder;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}
