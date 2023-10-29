import express, { Router } from "express";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import {
  getAllStudyEventsFromThinkSession,
  addStudyEventToThinkSession,
} from "../../controllers/studyevent.controller";
import { Database } from "sqlite";
import { StudyEvent } from "../../models/studyevent.model";

const studyEventsRouter: Router = express.Router();

function createStudyEvent(db: Database): Router {
  studyEventsRouter.get("/", async (req, res) => {
    res.status(200).send({ message: "You have reached the study event route" });
  });

  studyEventsRouter.get("/all/:thinksession_id", async (req, res) => {
    try {
      const studyEvents: any | FailureResponse =
        await getAllStudyEventsFromThinkSession(
          parseInt(req.params.thinksession_id),
          db
        );
      if (studyEvents instanceof FailureResponse) {
        res.status(studyEvents.status).send({ error: studyEvents.error });
      } else {
        res.status(200).send({ studyEvents: studyEvents });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  studyEventsRouter.post("/add/:thinksession_id", async (req, res) => {
    try {
      const studyEventResponse: StudyEvent | FailureResponse =
        await addStudyEventToThinkSession(
          parseInt(req.params.thinksession_id),
          req.body,
          db
        );
      if (studyEventResponse instanceof FailureResponse) {
        res.status(studyEventResponse.status).send({
          error: studyEventResponse.error,
        });
      } else {
        res.status(200).send({ message: studyEventResponse });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  return studyEventsRouter;
}

export default createStudyEvent;
