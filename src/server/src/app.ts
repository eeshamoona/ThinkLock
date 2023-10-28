import express, { Express, Request, Response } from "express";
import createThinkFoldersRouter from "./routes/thinkfolders";
import createThinkSessionsRouter from "./routes/thinksessions";
import dbPromise from "./utils/database";
import { Router } from "express";
import createStudyEventRouter from "./routes/studyevents";
import createActionItemRouter from "./routes/actionitems";
import createNotesRouter from "./routes/notes";
import createFlashcardsRouter from "./routes/flashcards";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello, this is Express + Typescript" });
});

(async () => {
  const thinkfolderRouter: Router = createThinkFoldersRouter(await dbPromise);
  const thinksessionRouter: Router = createThinkSessionsRouter(await dbPromise);
  const actionItemsRouter: Router = createActionItemRouter(await dbPromise);
  const studyEventsRouter: Router = createStudyEventRouter(await dbPromise);
  const notesRouter: Router = createNotesRouter(await dbPromise);
  const flashcardRouter: Router = createFlashcardsRouter(await dbPromise);

  app.use("/thinkfolders", thinkfolderRouter);
  app.use("/thinksessions", thinksessionRouter);
  app.use("/actionitems", actionItemsRouter);
  app.use("/studyevents", studyEventsRouter);
  app.use("/notes", notesRouter);
  app.use("/flashcards", flashcardRouter);
})();

export default app;

// // Start your Express server here, if needed
// const port = 3000; // Example port number
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
