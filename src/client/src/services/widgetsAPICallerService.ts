import axios from "axios";
import { FlashcardData } from "../utils/models/flashcard.model";

const API_URL = "/widgets";

export const createNotesWidget = async (
  thinksession_id: number
): Promise<number> => {
  const response = await axios.post(`${API_URL}/notes/${thinksession_id}`);
  return response.data.notesId;
};

export const getNotes = async (id: number): Promise<string> => {
  const response = await axios.get(`${API_URL}/notes/${id}`);
  return response.data.note;
};

export const updateNotesWidget = async (
  id: number,
  note: string
): Promise<string> => {
  const response = await axios.put(`${API_URL}/notes/${id}`, { note });
  return response.data;
};

export const deleteNotesWidget = async (id: number): Promise<string> => {
  const response = await axios.delete(`${API_URL}/notes/${id}`);
  return response.data;
};

export const getFlashcards = async (id: number): Promise<FlashcardData[]> => {
  const response = await axios.get(`${API_URL}/flashcards/${id}`);
  return response.data;
};

export const createFlashcardsWidget = async (
  thinksession_id: number
): Promise<number> => {
  const response = await axios.post(`${API_URL}/flashcards/${thinksession_id}`);
  return response.data.flashcardsId;
};

export const updateFlashcardsWidget = async (
  id: number,
  flashcards: FlashcardData[]
): Promise<string> => {
  const response = await axios.put(`${API_URL}/flashcards/${id}`, {
    flashcards,
  });
  return response.data;
};

export const deleteFlashcardsWidget = async (id: number): Promise<string> => {
  const response = await axios.delete(`${API_URL}/flashcards/${id}`);
  return response.data;
};
