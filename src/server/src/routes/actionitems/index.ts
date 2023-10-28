import express, { Router } from "express";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import {
  getActionItemById,
  createActionItem,
  getAllActionItemsByThinkFolderId,
  updateActionItem,
  getAllActionItemsByThinkSessionId,
  toggleCompletedActionItem,
} from "../../controllers/actionitems.controller";
import { ActionItem } from "../../models/actionitem.model";
import { Database } from "sqlite";

const actionItemsRouter: Router = express.Router();

function createActionItemRouter(db: Database): Router {
  actionItemsRouter.get("/", async (req, res) => {
    res
      .status(200)
      .send({ message: "You have reached the action items route" });
  });

  actionItemsRouter.get(
    "/all/thinkfolder/:thinkfolder_id",
    async (req, res) => {
      try {
        const actionitems: ActionItem[] | FailureResponse =
          await getAllActionItemsByThinkFolderId(
            parseInt(req.params.thinkfolder_id),
            db
          );
        if (actionitems instanceof FailureResponse) {
          res.status(actionitems.status).send({ error: actionitems.error });
        } else {
          res.status(200).send({ actionitems: actionitems });
        }
      } catch (error) {
        res.status(500).send({ error: `${error}` });
      }
    }
  );

  actionItemsRouter.get(
    "/all/thinksession/:thinksession_id",
    async (req, res) => {
      try {
        const actionitems: ActionItem[] | FailureResponse =
          await getAllActionItemsByThinkSessionId(
            parseInt(req.params.thinksession_id),
            db
          );
        if (actionitems instanceof FailureResponse) {
          res.status(actionitems.status).send({ error: actionitems.error });
        } else {
          res.status(200).send({ actionitems: actionitems });
        }
      } catch (error) {
        res.status(500).send({ error: `${error}` });
      }
    }
  );

  actionItemsRouter.get("/:id", async (req, res) => {
    try {
      const actionitem: ActionItem | FailureResponse = await getActionItemById(
        parseInt(req.params.id),
        db
      );
      if (actionitem instanceof FailureResponse) {
        res.status(actionitem.status).send({ error: actionitem.error });
      } else {
        res.status(200).send({ actionitem: actionitem });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  actionItemsRouter.post("/create", async (req, res) => {
    try {
      const createInfo: Partial<ActionItem> = req.body;
      const actionitem: ActionItem | FailureResponse = await createActionItem(
        createInfo,
        db
      );
      if (actionitem instanceof FailureResponse) {
        res.status(actionitem.status).send({ error: actionitem.error });
      } else {
        res.status(200).send({ actionitem: actionitem });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  actionItemsRouter.put("/update/:id", async (req, res) => {
    try {
      const actionItemId: SuccessResponse | FailureResponse =
        await updateActionItem(parseInt(req.params.id), req.body, db);
      if (actionItemId instanceof FailureResponse) {
        res.status(actionItemId.status).send({ error: actionItemId.error });
      } else {
        res.status(200).send({ actionItemId: actionItemId });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  actionItemsRouter.put("/complete/:id", async (req, res) => {
    try {
      const actionItemResponse: SuccessResponse | FailureResponse =
        await toggleCompletedActionItem(parseInt(req.params.id), db);
      if (actionItemResponse instanceof FailureResponse) {
        res
          .status(actionItemResponse.status)
          .send({ error: actionItemResponse.error });
      } else {
        res.status(200).send({ actionItemResponse: actionItemResponse.message });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  return actionItemsRouter;
}

export default createActionItemRouter;
