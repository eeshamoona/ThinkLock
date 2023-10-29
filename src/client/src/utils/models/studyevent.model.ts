export enum StudyEventTypes {
  "actionitem_created" = "actionitem_created",
  "actionitem_completed" = "actionitem_completed",
  "actionitem_unfinished" = "actionitem_unfinished",
}

export interface StudyEvent {
  id: number;
  thinksession_id: number;
  event_type: string;
  timestamp: Date;
  details: string;
  reference_id?: number;
}
