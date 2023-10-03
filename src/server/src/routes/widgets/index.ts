import express, { Router } from "express";
import {
  createNotesWidget,
  getNotes,
  updateNotesWidget,
  deleteNotesWidget,
} from "../../controllers/noteswidget.controller";
import { FailureResponse } from "../../utils/responses";
import {
  createFlashcardsWidget,
  getFlashcards,
  updateFlashcardsWidget,
  deleteFlashcardsWidget,
} from "../../controllers/flashcardswidget.controller";
import { Flashcards } from "../../models/flashcards.model";

const widgetsRouter: Router = express.Router();

widgetsRouter.get("/", async (req, res) => {
  res.status(200).send({ message: "You have reached the widgets route" });
});

widgetsRouter.post("/notes/:thinksession_id", async (req, res) => {
  try {
    const notesId: number | FailureResponse = await createNotesWidget(
      parseInt(req.params.thinksession_id)
    );
    return res.status(200).send({ notesId: notesId });
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.get("/notes/:id", async (req, res) => {
  try {
    const notes: string | FailureResponse = await getNotes(
      parseInt(req.params.id)
    );
    return res.status(200).send(notes);
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.put("/notes/:id", async (req, res) => {
  try {
    const notes: string | FailureResponse = await updateNotesWidget(
      parseInt(req.params.id),
      req.body.note
    );
    return res.status(200).send(`Updated notes ${req.params.id}: ${notes}`);
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.delete("/notes/:id", async (req, res) => {
  try {
    const notes: string | FailureResponse = await deleteNotesWidget(
      parseInt(req.params.id)
    );
    return res.status(200).send(notes);
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.get("/flashcards/:id", async (req, res) => {
  try {
    const flashcards: any[] | FailureResponse = await getFlashcards(
      parseInt(req.params.id)
    );
    if (flashcards instanceof FailureResponse) {
      res.status(flashcards.status).send({ error: flashcards.error });
    } else {
      return res.status(200).send(flashcards);
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.post("/flashcards/:thinksession_id", async (req, res) => {
  try {
    const flashcardsId: number | FailureResponse = await createFlashcardsWidget(
      parseInt(req.params.thinksession_id)
    );
    return res.status(200).send({ flashcardsId: flashcardsId });
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.put("/flashcards/:id", async (req, res) => {
  try {
    const flashcards: string | FailureResponse = await updateFlashcardsWidget(
      parseInt(req.params.id),
      JSON.stringify(req.body.flashcards)
    );
    return res
      .status(200)
      .send(`Updated flashcards ${req.params.id}: ${flashcards}`);
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.delete("/flashcards/:id", async (req, res) => {
  try {
    const flashcards: string | FailureResponse = await deleteFlashcardsWidget(
      parseInt(req.params.id)
    );
    return res.status(200).send(flashcards);
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

export default widgetsRouter;
