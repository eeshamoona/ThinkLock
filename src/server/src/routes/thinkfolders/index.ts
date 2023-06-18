import express, { Router } from "express";
import { FailureResponse } from "../../utils/responses";
import { getAllThinkFolders } from "../../controllers/thinkfolder.controller";
import { ThinkFolder } from "../../models/thinkfolder.model";

const thinkFolderRouter: Router = express.Router();

thinkFolderRouter.get("/", async (req, res) => {
  res.status(200).send({ message: "You have reached the thinkfolder route" });
});

thinkFolderRouter.get("/all", async (req, res) => {
  try {
    const thinkfolders: ThinkFolder[] | FailureResponse =
      await getAllThinkFolders();
    if (thinkfolders instanceof FailureResponse) {
      res.status(thinkfolders.status).send({ error: thinkfolders.error });
    } else {
      res.status(200).send({ thinkfolders: thinkfolders });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

export default thinkFolderRouter;
