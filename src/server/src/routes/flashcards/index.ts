import express, { Router } from "express";
import {
  getAllFlashcards,
  deleteFlashcard,
  createFlashcard,
  updateFlashcard,
} from "../../controllers/flashcards.controller";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import { Notes } from "../../models/notes.model";
import { Database } from "sqlite";
import { Flashcard } from "../../models/flashcard.model";

const flashcardsRouter: Router = express.Router();

function createFlashcardsRouter(db: Database): Router {
  flashcardsRouter.get("/", async (req, res) => {
    res.status(200).send({ message: "You have reached the flashcards route" });
  });

  flashcardsRouter.get("/:thinksession_id", async (req, res) => {
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

  flashcardsRouter.post("/:thinksession_id", async (req, res) => {
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

  flashcardsRouter.delete("/:flashcard_id", async (req, res) => {
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

  flashcardsRouter.put("/:flashcard_id", async (req, res) => {
    try {
      const flashcardToUpdate: Partial<Flashcard> = {
        front: req.body.front,
        back: req.body.back,
      };
      const updateFlashcardResponse: SuccessResponse | FailureResponse =
        await updateFlashcard(
          parseInt(req.params.flashcard_id),
          flashcardToUpdate,
          db
        );
      if (updateFlashcardResponse instanceof FailureResponse) {
        res.status(updateFlashcardResponse.status).send({
          error: updateFlashcardResponse.error,
        });
      } else {
        res.status(200).send({ message: updateFlashcardResponse.message });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  return flashcardsRouter;
}

export default createFlashcardsRouter;
