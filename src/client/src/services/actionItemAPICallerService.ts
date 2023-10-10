import axios from "axios";
import { ActionItem } from "../utils/models/actionitem.model";

export async function addActionItem(
  actionItem: Pick<
    ActionItem,
    "title" | "description" | "thinkfolder_id" | "thinksession_id"
  >
): Promise<number | string> {
  try {
    const response = await axios.post("/actionitems/create", actionItem);
    return response.data.actionItemId as string;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllActionItems(): Promise<ActionItem[] | string> {
  try {
    const response = await axios.get("/actionitems/all");
    return response.data.actionitems;
  } catch (err) {
    return `${err}`;
  }
}

export async function getActionItemById(
  actionItemId: number
): Promise<ActionItem | string> {
  try {
    const response = await axios.get(`/actionitems/${actionItemId}`);
    return response.data.actionitem;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllActionItemsByThinkFolderId(
  thinkFolderId: number
): Promise<ActionItem[] | string> {
  try {
    const response = await axios.get(`/actionitems/all/${thinkFolderId}`);
    return response.data.actionItems;
  } catch (err) {
    return `${err}`;
  }
}

//TODO: Determine if this function should live in the backend only...
export async function getActionItemsWithNullThinkSessionId(
  thinkFolderId: number
): Promise<ActionItem[] | string> {
  try {
    const actionItems = await getAllActionItemsByThinkFolderId(thinkFolderId);
    if (typeof actionItems === "string") return actionItems;
    return actionItems.filter(
      (actionItem) => actionItem.thinksession_id === null
    );
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllActionItemsByThinkSessionId(
  thinkSessionId: number
): Promise<ActionItem[] | string> {
  try {
    const response = await axios.get(
      `/actionitems/all/thinksession/${thinkSessionId}`
    );
    return response.data.actionItems;
  } catch (err) {
    return `${err}`;
  }
}

export async function updateActionItem(
  actionItemId: number,
  actionItem: Partial<ActionItem>
): Promise<string> {
  try {
    const response = await axios.put(
      `/actionitems/update/${actionItemId}`,
      actionItem
    );
    return response.data.message;
  } catch (err) {
    return `${err}`;
  }
}

export async function toggleCompletedActionItem(
  actionItemId: string
): Promise<string> {
  try {
    const response = await axios.put(`/actionitems/complete/${actionItemId}`);
    return response.data.message;
  } catch (err) {
    return `${err}`;
  }
}
