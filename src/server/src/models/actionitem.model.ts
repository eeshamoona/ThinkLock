export class ActionItem {
  id: number;
  thinksession_id: number;
  thinkfolder_id: number;
  title: string;
  description: string;
  completed: boolean;

  constructor(
    id: number,
    thinksession_id: number,
    thinkfolder_id: number,
    title: string,
    description: string,
    completed: boolean,
  ) {
    this.id = id;
    this.thinksession_id = thinksession_id;
    this.thinkfolder_id = thinkfolder_id;
    this.title = title;
    this.description = description;
    this.completed = completed;
  }
}
