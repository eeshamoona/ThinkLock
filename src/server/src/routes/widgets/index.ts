import express, { Router } from "express";
import {
  getNotes,
  createNotes,
  updateNotes,
} from "../../controllers/notes.controller.";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import { Notes } from "../../models/notes.model";

const widgetsRouter: Router = express.Router();

widgetsRouter.get("/", async (req, res) => {
  res.status(200).send({ message: "You have reached the widgets route" });
});

widgetsRouter.get("/notes/:thinksession_id", async (req, res) => {
  try {
    const notes: Notes | FailureResponse = await getNotes(
      parseInt(req.params.thinksession_id)
    );
    if (notes instanceof FailureResponse) {
      res.status(notes.status).send({ error: notes.error });
    } else {
      res.status(200).send({ notes: notes.content });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.post("/notes/:thinksession_id", async (req, res) => {
  try {
    const notesId: number | FailureResponse = await createNotes(
      parseInt(req.params.thinksession_id)
    );
    if (notesId instanceof FailureResponse) {
      res.status(notesId.status).send({ error: notesId.error });
    } else {
      res.status(200).send({ notesId: notesId });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

widgetsRouter.put("/notes/:thinksession_id", async (req, res) => {
  try {
    const updateNotesResponse: SuccessResponse | FailureResponse =
      await updateNotes(parseInt(req.params.thinksession_id), req.body.content);
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

export default widgetsRouter;
