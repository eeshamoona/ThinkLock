export interface ThinkSession {
  id: number;
  thinkfolder_id: number;
  title: string;
  date: Date;
  location: string;
  start_time: Date;
  end_time: Date;
  thinkfolder_icon?: string;
  thinkfolder_color?: string;
  layout?: string;
}
//
