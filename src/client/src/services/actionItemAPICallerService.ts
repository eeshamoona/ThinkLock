import axios from "axios";
import {
  FailureResponse,
  SuccessResponse,
} from "../utils/models/responses.model";
import { ActionItem } from "../utils/models/actionitem.model";
const API_URL = "http://localhost:3000/actionitems";

export async function getAllActionItemsByThinkFolderId(
  thinkfolder_id: number,
): Promise<ActionItem[] | FailureResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/all/thinkfolder/${thinkfolder_id}`,
    );
    return response.data.actionitems;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error,
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function getAllActionItemsByThinkSessionId(
  thinksession_id: number,
): Promise<ActionItem[] | FailureResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/all/thinksession/${thinksession_id}`,
    );
    return response.data.actionitems;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error,
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function getActionItemById(
  id: number,
): Promise<ActionItem | FailureResponse> {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.actionitem;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error,
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function createActionItem(
  createInfo: Partial<ActionItem>,
): Promise<ActionItem | FailureResponse> {
  try {
    const response = await axios.post(`${API_URL}/create`, createInfo);
    return response.data.actionitem;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error,
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function updateActionItem(
  id: number,
  updateInfo: Partial<ActionItem>,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, updateInfo);
    return response.data.actionItemId;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error,
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function toggleCompletedActionItem(
  id: number,
): Promise<SuccessResponse | FailureResponse> {
  try {
    const response = await axios.put(`${API_URL}/complete/${id}`);
    return response.data.actionItemResponse;
  } catch (error: any) {
    if (error.response) {
      return new FailureResponse(
        error.response.status,
        error.response.data.error,
      );
    } else {
      return new FailureResponse(500, error.message);
    }
  }
}

export async function getActionItemsWithNoThinkSession(
  thinkfolder_id: number,
): Promise<ActionItem[] | FailureResponse> {
  try {
    const actionItems = await getAllActionItemsByThinkFolderId(thinkfolder_id);
    if (typeof actionItems === "string")
      return new FailureResponse(500, actionItems);

    return (actionItems as ActionItem[]).filter(
      (actionItem) => actionItem.thinksession_id === null,
    );
  } catch (err) {
    return new FailureResponse(500, `${err}`);
  }
}
