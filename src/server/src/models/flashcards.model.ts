import { Widget } from "./widget.model";

class Flashcard {
  front!: string;
  back!: string;
  id!: string;
}
export class Flashcards extends Widget {
  flashcards: Array<Flashcard>;

  constructor(
    id: number,
    thinksession_id: number,
    flashcards: Array<Flashcard>
  ) {
    super(id, thinksession_id); // Call the constructor of the base class
    this.flashcards = flashcards;
  }

  // Override the base class methods:
  getData() {
    // Implementation for fetching flashcard data
    return this.flashcards;
  }

  updateFlashcard(id: number, flashcard: Flashcard) {
    // Implementation for updating flashcard data
    return (this.flashcards[id] = flashcard);
  }

  deleteFlashcard(id: number) {
    // Implementation for deleting flashcard data
    return this.flashcards.splice(id, 1);
  }

  addFlashcard(flashcard: Flashcard) {
    // Implementation for creating flashcard data
    return this.flashcards.push(flashcard);
  }
}
