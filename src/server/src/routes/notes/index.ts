import express, { Router } from "express";
import {
  getNotes,
  createNotes,
  updateNotes,
} from "../../controllers/notes.controller";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import { Notes } from "../../models/notes.model";
import { Database } from "sqlite";

const notesRouter: Router = express.Router();

function createNotesRouter(db: Database): Router {
  notesRouter.get("/", async (req, res) => {
    res.status(200).send({ message: "You have reached the notes route" });
  });

  notesRouter.get("/:thinksession_id", async (req, res) => {
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

  notesRouter.post("/:thinksession_id", async (req, res) => {
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

  notesRouter.put("/:thinksession_id", async (req, res) => {
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

  return notesRouter;
}

export default createNotesRouter;
