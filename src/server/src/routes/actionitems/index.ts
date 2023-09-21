import express, { Router } from "express";
import { FailureResponse, SuccessResponse } from "../../utils/responses";
import {
  getAllActionItems,
  getActionItemById,
  createActionItem,
  getAllActionItemsByThinkFolderId,
  updateActionItem,
  getAllActionItemsByThinkSessionId,
} from "../../controllers/actionitem.controller";
import { ActionItem } from "../../models/actionitem.model";

const actionItemsRouter: Router = express.Router();

actionItemsRouter.get("/", async (req, res) => {
  res.status(200).send({ message: "You have reached the action item route" });
});

actionItemsRouter.get("/all", async (req, res) => {
  try {
    const actionItems: ActionItem[] | FailureResponse =
      await getAllActionItems();
    if (actionItems instanceof FailureResponse) {
      res.status(actionItems.status).send({ error: actionItems.error });
    } else {
      res.status(200).send({ actionItems: actionItems });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

actionItemsRouter.get("/all/:think_folder_id", async (req, res) => {
  try {
    const actionItems: ActionItem[] | FailureResponse =
      await getAllActionItemsByThinkFolderId(req.params.think_folder_id);
    if (actionItems instanceof FailureResponse) {
      res.status(actionItems.status).send({ error: actionItems.error });
    } else {
      res.status(200).send({ actionItems: actionItems });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

actionItemsRouter.get(
  "/all/thinksession/:thinksession_id",
  async (req, res) => {
    try {
      const actionItems: ActionItem[] | FailureResponse =
        await getAllActionItemsByThinkSessionId(req.params.thinksession_id);
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
      parseInt(req.params.id)
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
    const actionItemId: number | FailureResponse = await createActionItem(
      req.body.thinksession_id,
      req.body.thinkfolder_id,
      req.body.description,
      req.body.title
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
      await updateActionItem(parseInt(req.params.id), req.body);
    if (actionItemId instanceof FailureResponse) {
      res.status(actionItemId.status).send({ error: actionItemId.error });
    } else {
      res.status(200).send({ actionItemId: actionItemId });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

export default actionItemsRouter;
