import express, { Express, Request, Response } from "express";
import createThinkFoldersRouter from "./routes/thinkfolders";
import actionItemsRouter from "./routes/actionitems";
import createThinkSessionsRouter from "./routes/thinksessions";
import { Logger } from "./utils/logger";
import dbPromise from "./utils/database";
import { Router } from "express";
import studyEventsRouter from "./routes/studyevents";
import createWidgetsRouter from "./routes/widgets";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello, this is Express + Typescript" });
});

(async () => {
  const thinkfolderRouter: Router = createThinkFoldersRouter(await dbPromise);
  const thinksessionRouter: Router = createThinkSessionsRouter(await dbPromise);
  const widgetsRouter: Router = createWidgetsRouter(await dbPromise);
  
  app.use("/thinkfolders", thinkfolderRouter);
  app.use("/actionitems", actionItemsRouter);
  app.use("/thinksessions", thinksessionRouter);
  app.use("/widgets", widgetsRouter);
  app.use("/studyevents", studyEventsRouter);
})();

export default app;

// // Start your Express server here, if needed
// const port = 3000; // Example port number
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
