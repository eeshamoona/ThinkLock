import express, { Router } from "express";
import {
  createNotesWidget,
  getNotes,
} from "../../controllers/noteswidget.controller";
import { FailureResponse } from "../../utils/responses";
import {
  createFlashcardsWidget,
  getFlashcards,
} from "../../controllers/flashcardswidget.controller";
import { Flashcards } from "../../models/flashcards.model";

const widgetsRouter: Router = express.Router();

widgetsRouter.get("/", async (req, res) => {
  res.status(200).send({ message: "You have reached the widgets route" });
});

widgetsRouter.post("/notes/:thinkfolder_id", async (req, res) => {
  try {
    const notesId: number | FailureResponse = await createNotesWidget(
      parseInt(req.params.thinkfolder_id)
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

widgetsRouter.get("/flashcards/:id", async (req, res) => {
  try {
    const flashcards: Flashcards | FailureResponse = await getFlashcards(
      parseInt(req.params.id)
    );
    return res.status(200).send(flashcards);
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.post("/flashcards/:thinkfolder_id", async (req, res) => {
  try {
    const flashcardsId: number | FailureResponse = await createFlashcardsWidget(
      parseInt(req.params.thinkfolder_id)
    );
    return res.status(200).send({ flashcardsId: flashcardsId });
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

export default widgetsRouter;
