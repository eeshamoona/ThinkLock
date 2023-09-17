export interface ThinkSession {
  id: number;
  thinkfolder_id: number;
  title: string;
  description: string;
  date: Date;
  start_time: Date;
  end_time: Date;
  duration: number;
  notes: string;
  summary: string;
  location: string;
}
