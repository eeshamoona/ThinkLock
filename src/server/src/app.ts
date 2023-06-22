import express, { Express, Request, Response } from "express";
import thinkFoldersRouter from "./routes/thinkfolders";
import actionItemsRouter from "./routes/actionitems";
import thinkSessionsRouter from "./routes/thinksessions";

// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
// import swaggerOptions from "./utils/swagger_options";

// const specs = swaggerJsdoc(swaggerOptions);
const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello, this is Express + Typescript" });
});

app.use("/thinkfolders", thinkFoldersRouter);
app.use("/actionitems", actionItemsRouter);
app.use("/thinksessions", thinkSessionsRouter);

// app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

export default app;
