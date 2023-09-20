import { ActionItem } from "./actionitem.model";

export interface ThinkSession {
  id: number;
  thinkfolder_id: number;
  title: string;
  date: Date;
  location: string;
  start_time: Date;
  end_time: Date;
  duration?: number;
  notes?: string;
  summary?: string;
  thinkfolder_icon?: string;
  thinkfolder_color?: string;
  action_items?: ActionItem[];
}
