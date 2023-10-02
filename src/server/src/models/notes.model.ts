import { Widget } from "./widget.model";

export class Notes extends Widget {
  notes: string;

  constructor(id: number, thinksession_id: number, notes: string) {
    super(id, thinksession_id);
    this.notes = notes;
  }

  // Override the base class methods:
  getData() {
    return this.notes;
  }

  updateNotes(notes: string) {
    return (this.notes = notes);
  }

  clearNotes() {
    return (this.notes = "");
  }
}
