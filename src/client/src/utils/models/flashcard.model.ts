export enum Status {
  New = "new",
  Review = "review",
  Learned = "learned",
}
export interface Flashcard {
  id: number;
  front: string;
  back: string;
  status: Status;
  thinksession_id: number;
  thinkfolder_id: number;
}
