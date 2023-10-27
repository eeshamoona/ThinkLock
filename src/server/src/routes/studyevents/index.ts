import express, { Router } from "express";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import {
  getAllStudyEventsFromThinkSession,
  addStudyEventToThinkSession,
} from "../../controllers/studyevent.controller";
import { Database } from "sqlite";

const studyEventsRouter: Router = express.Router();

function createStudyEvent(db: Database): Router {
  studyEventsRouter.get("/", async (req, res) => {
    res.status(200).send({ message: "You have reached the study event route" });
  });

  studyEventsRouter.get("/all/:thinksession_id", async (req, res) => {
    try {
      const studyEvents = await getAllStudyEventsFromThinkSession(
        parseInt(req.params.thinksession_id)
      );
      res.status(200).send({ studyEvents: studyEvents });
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  studyEventsRouter.post("/add", async (req, res) => {
    try {
      const studyEventId = await addStudyEventToThinkSession(
        req.body.thinksession_id,
        req.body.event_type,
        req.body.details,
        req.body.reference_id
      );
      if (studyEventId instanceof FailureResponse) {
        res.status(studyEventId.status).send({ error: studyEventId.error });
      } else {
        res.status(200).send({ studyEventId: studyEventId });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  return studyEventsRouter;
}

export default createStudyEvent;
