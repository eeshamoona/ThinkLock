import express, { Express, Request, Response } from "express";
import createThinkFoldersRouter from "./routes/thinkfolders";
import actionItemsRouter from "./routes/actionitems";
import thinkSessionsRouter from "./routes/thinksessions";
import { Logger } from "./utils/logger";
import dbPromise from "./utils/database";
import { Router } from "express";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello, this is Express + Typescript" });
});

(async () => {
  const router: Router = createThinkFoldersRouter(await dbPromise);
  app.use("/thinkfolders", router);
  app.use("/actionitems", actionItemsRouter);
  app.use("/thinksessions", thinkSessionsRouter);
})();

export default app;

// // Start your Express server here, if needed
// const port = 3000; // Example port number
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
