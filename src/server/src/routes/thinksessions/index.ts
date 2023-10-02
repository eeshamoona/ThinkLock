import express, { Router } from "express";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import {
  createThinkSession,
  getAllThinkSessions,
  getThinkSessionById,
  getAllThinkSessionsByThinkFolderId,
  getAllThinkSessionsByDate,
  getThinkSessionHeatMapByYear,
  updateThinkSession,
} from "../../controllers/thinksession.controller";
import { ThinkSession } from "../../models/thinksession.model";
import { HeatmapData } from "../../models/heatmapdata.model";

const thinkSessionsRouter: Router = express.Router();

thinkSessionsRouter.get("/", async (req, res) => {
  res.status(200).send({ message: "You have reached the thinksession route" });
});

thinkSessionsRouter.get("/all", async (req, res) => {
  try {
    const thinksessions: ThinkSession[] | FailureResponse =
      await getAllThinkSessions();
    if (thinksessions instanceof FailureResponse) {
      res.status(thinksessions.status).send({ error: thinksessions.error });
    } else {
      res.status(200).send({ thinksessions: thinksessions });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

thinkSessionsRouter.get("/all/:think_folder_id", async (req, res) => {
  try {
    const thinksessions: ThinkSession[] | FailureResponse =
      await getAllThinkSessionsByThinkFolderId(
        parseInt(req.params.think_folder_id)
      );
    if (thinksessions instanceof FailureResponse) {
      res.status(thinksessions.status).send({ error: thinksessions.error });
    } else {
      res.status(200).send({ thinksessions: thinksessions });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

thinkSessionsRouter.get("/heatmap/:thinkfolder_id/:year", async (req, res) => {
  try {
    const heatmapData: HeatmapData[] | FailureResponse =
      await getThinkSessionHeatMapByYear(
        parseInt(req.params.year),
        parseInt(req.params.thinkfolder_id)
      );
    if (heatmapData instanceof FailureResponse) {
      res.status(heatmapData.status).send({ error: heatmapData.error });
    } else {
      let maxHours = 0;
      heatmapData.forEach((entry) => {
        if (entry.total_hours > maxHours) {
          maxHours = entry.total_hours;
        }
      });

      res.status(200).send({
        heatmapData: heatmapData,
        max_hours: maxHours,
      });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

thinkSessionsRouter.get("/:id", async (req, res) => {
  try {
    const thinksession: ThinkSession | FailureResponse =
      await getThinkSessionById(parseInt(req.params.id));
    if (thinksession instanceof FailureResponse) {
      res.status(thinksession.status).send({ error: thinksession.error });
    } else {
      res.status(200).send({ thinksession: thinksession });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

thinkSessionsRouter.get("/all/date/:date", async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const thinksessions: ThinkSession[] | FailureResponse =
      await getAllThinkSessionsByDate(date);
    if (thinksessions instanceof FailureResponse) {
      res.status(thinksessions.status).send({ error: thinksessions.error });
    } else {
      res.status(200).send({ thinksessions: thinksessions });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

thinkSessionsRouter.post("/create", async (req, res) => {
  try {
    const createInfo: Partial<ThinkSession> = req.body;
    const thinksession_id: number | FailureResponse =
      await createThinkSession(createInfo);
    if (thinksession_id instanceof FailureResponse) {
      res.status(thinksession_id.status).send({ error: thinksession_id.error });
    } else {
      res.status(200).send({ thinksession_id: thinksession_id });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

thinkSessionsRouter.put("/update/:id", async (req, res) => {
  try {
    const thinkSessionId: SuccessResponse | FailureResponse =
      await updateThinkSession(parseInt(req.params.id), req.body);
    if (thinkSessionId instanceof FailureResponse) {
      res.status(thinkSessionId.status).send({ error: thinkSessionId.error });
    } else {
      res.status(200).send({ response: thinkSessionId });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

export default thinkSessionsRouter;
