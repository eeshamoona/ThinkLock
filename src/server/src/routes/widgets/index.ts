import express, { Router } from "express";
import {
  getNotes,
  createNotes,
  updateNotes,
} from "../../controllers/notes.controller";
import {
  getAllFlashcards,
  deleteFlashcard,
  createFlashcard,
} from "../../controllers/flashcard.controller";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import { Notes } from "../../models/notes.model";
import { Database } from "sqlite";
import { Flashcard } from "../../models/flashcard.model";

const widgetsRouter: Router = express.Router();

function createWidgetsRouter(db: Database): Router {
  widgetsRouter.get("/", async (req, res) => {
    res.status(200).send({ message: "You have reached the widgets route" });
  });

  widgetsRouter.get("/notes/:thinksession_id", async (req, res) => {
    try {
      const notes: string | FailureResponse = await getNotes(
        parseInt(req.params.thinksession_id),
        db
      );
      if (notes instanceof FailureResponse) {
        res.status(notes.status).send({ error: notes.error });
      } else {
        res.status(200).send({ notes: notes });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  widgetsRouter.post("/notes/:thinksession_id", async (req, res) => {
    try {
      const notesResponse: SuccessResponse | FailureResponse =
        await createNotes(parseInt(req.params.thinksession_id), db);
      if (notesResponse instanceof FailureResponse) {
        res.status(notesResponse.status).send({ error: notesResponse.error });
      } else {
        res.status(200).send({ message: notesResponse.message });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  widgetsRouter.put("/notes/:thinksession_id", async (req, res) => {
    try {
      const updateNotesResponse: SuccessResponse | FailureResponse =
        await updateNotes(
          parseInt(req.params.thinksession_id),
          req.body.content,
          db
        );
      if (updateNotesResponse instanceof FailureResponse) {
        res.status(updateNotesResponse.status).send({
          error: updateNotesResponse.error,
        });
      } else {
        res.status(200).send({ message: updateNotesResponse.message });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  widgetsRouter.get("/flashcards/:thinksession_id", async (req, res) => {
    try {
      const flashcards: Flashcard[] | FailureResponse = await getAllFlashcards(
        parseInt(req.params.thinksession_id),
        db
      );
      if (flashcards instanceof FailureResponse) {
        res.status(flashcards.status).send({ error: flashcards.error });
      } else {
        res.status(200).send({ flashcards: flashcards });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  widgetsRouter.post("/flashcards/:thinksession_id", async (req, res) => {
    try {
      const flashcardToCreate: Partial<Flashcard> = {
        front: req.body.front,
        back: req.body.back,
      };
      const flashcardResponse: SuccessResponse | FailureResponse =
        await createFlashcard(
          parseInt(req.params.thinksession_id),
          flashcardToCreate,
          db
        );
      if (flashcardResponse instanceof FailureResponse) {
        res.status(flashcardResponse.status).send({
          error: flashcardResponse.error,
        });
      } else {
        res.status(200).send({ message: flashcardResponse.message });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  widgetsRouter.delete("/flashcards/:flashcard_id", async (req, res) => {
    try {
      const deleteFlashcardResponse: SuccessResponse | FailureResponse =
        await deleteFlashcard(parseInt(req.params.flashcard_id), db);
      if (deleteFlashcardResponse instanceof FailureResponse) {
        res.status(deleteFlashcardResponse.status).send({
          error: deleteFlashcardResponse.error,
        });
      } else {
        res.status(200).send({ message: deleteFlashcardResponse.message });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  return widgetsRouter;
}

export default createWidgetsRouter;
