import express, { Router } from "express";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import {
  getActionItemById,
  createActionItem,
  getAllActionItemsByThinkFolderId,
  updateActionItem,
  getAllActionItemsByThinkSessionId,
  toggleCompletedActionItem,
} from "../../controllers/actionitem.controller";
import { ActionItem } from "../../models/actionitem.model";
import { Database } from "sqlite";

const actionItemsRouter: Router = express.Router();

function createActionItemRouter(db: Database): Router {
  actionItemsRouter.get("/", async (req, res) => {
    res.status(200).send({ message: "You have reached the action item route" });
  });

  actionItemsRouter.get(
    "/all/thinkfolder/:think_folder_id",
    async (req, res) => {
      try {
        const actionItems: ActionItem[] | FailureResponse =
          await getAllActionItemsByThinkFolderId(
            parseInt(req.params.think_folder_id),
            db
          );
        if (actionItems instanceof FailureResponse) {
          res.status(actionItems.status).send({ error: actionItems.error });
        } else {
          res.status(200).send({ actionItems: actionItems });
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
        const actionItems: ActionItem[] | FailureResponse =
          await getAllActionItemsByThinkSessionId(
            parseInt(req.params.thinksession_id),
            db
          );
        if (actionItems instanceof FailureResponse) {
          res.status(actionItems.status).send({ error: actionItems.error });
        } else {
          res.status(200).send({ actionItems: actionItems });
        }
      } catch (error) {
        res.status(500).send({ error: `${error}` });
      }
    }
  );

  actionItemsRouter.get("/:id", async (req, res) => {
    try {
      const actionItem: ActionItem | FailureResponse = await getActionItemById(
        parseInt(req.params.id),
        db
      );
      if (actionItem instanceof FailureResponse) {
        res.status(actionItem.status).send({ error: actionItem.error });
      } else {
        res.status(200).send({ actionItem: actionItem });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  actionItemsRouter.post("/create", async (req, res) => {
    try {
      const createInfo: Partial<ActionItem> = req.body;
      const actionItemId: number | FailureResponse = await createActionItem(
        createInfo,
        db
      );
      if (actionItemId instanceof FailureResponse) {
        res.status(actionItemId.status).send({ error: actionItemId.error });
      } else {
        res.status(200).send({ actionItemId: actionItemId });
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
      const completedResponse: SuccessResponse | FailureResponse =
        await toggleCompletedActionItem(parseInt(req.params.id), db);
      if (completedResponse instanceof FailureResponse) {
        res
          .status(completedResponse.status)
          .send({ error: completedResponse.error });
      } else {
        res.status(200).send({ message: completedResponse });
      }
    } catch (error) {
      res.status(500).send({ error: `${error}` });
    }
  });

  return actionItemsRouter;
}

export default createActionItemRouter;
