import axios from "axios";
import { ActionItem } from "../utils/models/actionitem.model";

export async function addActionItem(
  actionItem: Pick<ActionItem, "title" | "description" | "thinkfolder_id">,
): Promise<number | string> {
  try {
    const response = await axios.post("/actionitems/create", actionItem);
    return response.data.actionitem_id;
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
  actionItemId: number,
): Promise<ActionItem | string> {
  try {
    const response = await axios.get(`/actionitems/${actionItemId}`);
    return response.data.actionitem;
  } catch (err) {
    return `${err}`;
  }
}

export async function getAllActionItemsByThinkFolderId(
  thinkFolderId: number,
): Promise<ActionItem[] | string> {
  try {
    const response = await axios.get(`/actionitems/all/${thinkFolderId}`);
    return response.data.actionitems;
  } catch (err) {
    return `${err}`;
  }
}
