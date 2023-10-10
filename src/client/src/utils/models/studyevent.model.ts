export interface StudyEvent {
  id: number;
  thinksession_id: number;
  event_type: string;
  timestamp: Date;
  details: string;
  reference_id?: number;
}
