export class ThinkSession {
  id!: number;
  thinkfolder_id!: number;
  title!: string;
  date!: string;
  duration?: number;
  start_time!: string;
  end_time!: string;
  location!: string;
  notes?: string;
  summary?: string;
  layout?: any[];
}
