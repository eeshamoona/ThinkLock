import express, { Express, Request, Response } from "express";
import createThinkFoldersRouter from "./routes/thinkfolders";
import createThinkSessionsRouter from "./routes/thinksessions";
import { Logger } from "./utils/logger";
import dbPromise from "./utils/database";
import { Router } from "express";
import createStudyEventRouter from "./routes/studyevents";
import createWidgetsRouter from "./routes/widgets";
import createActionItemRouter from "./routes/actionitems";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello, this is Express + Typescript" });
});

(async () => {
  const thinkfolderRouter: Router = createThinkFoldersRouter(await dbPromise);
  const thinksessionRouter: Router = createThinkSessionsRouter(await dbPromise);
  const widgetsRouter: Router = createWidgetsRouter(await dbPromise);
  const actionItemsRouter: Router = createActionItemRouter(await dbPromise);
  const studyEventsRouter: Router = createStudyEventRouter(await dbPromise);

  app.use("/thinkfolders", thinkfolderRouter);
  app.use("/thinksessions", thinksessionRouter);
  app.use("/widgets", widgetsRouter);
  app.use("/actionitems", actionItemsRouter);
  app.use("/studyevents", studyEventsRouter);
})();

export default app;

// // Start your Express server here, if needed
// const port = 3000; // Example port number
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
