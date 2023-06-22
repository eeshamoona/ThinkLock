import express, { Router } from "express";
import { FailureResponse } from "../../utils/responses";
import {
  createThinkFolder,
  getAllThinkFolders,
  getThinkFolderById,
} from "../../controllers/thinkfolder.controller";
import { ThinkFolder } from "../../models/thinkfolder.model";

const thinkFoldersRouter: Router = express.Router();

thinkFoldersRouter.get("/", async (req, res) => {
  res.status(200).send({ message: "You have reached the thinkfolder route" });
});

thinkFoldersRouter.get("/all", async (req, res) => {
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

thinkFoldersRouter.get("/:id", async (req, res) => {
  try {
    const thinkfolder: ThinkFolder | FailureResponse = await getThinkFolderById(
      parseInt(req.params.id)
    );
    if (thinkfolder instanceof FailureResponse) {
      res.status(thinkfolder.status).send({ error: thinkfolder.error });
    } else {
      res.status(200).send({ thinkfolder: thinkfolder });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

thinkFoldersRouter.post("/create", async (req, res) => {
  try {
    const createInfo: Partial<ThinkFolder> = req.body;
    const thinkfolder: number | FailureResponse = await createThinkFolder(
      createInfo
    );
    if (thinkfolder instanceof FailureResponse) {
      res.status(thinkfolder.status).send({ error: thinkfolder.error });
    } else {
      res.status(200).send({ thinkfolder: thinkfolder });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

export default thinkFoldersRouter;
