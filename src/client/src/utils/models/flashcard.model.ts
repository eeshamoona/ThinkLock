import { Widget } from "./widget.model";

export interface FlashcardData {
  front: string;
  back: string;
  id: number;
}
export interface Flashcards extends Widget {
  flashcards: Array<FlashcardData>;
}
