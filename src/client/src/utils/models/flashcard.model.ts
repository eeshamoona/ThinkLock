import { Widget } from "./widget.model";

export interface FlashcardData {
  front: string;
  back: string;
  id: string;
}
export interface Flashcards extends Widget {
  flashcards: Array<FlashcardData>;
}
