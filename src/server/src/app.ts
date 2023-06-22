import express, { Express, Request, Response } from "express";
import thinkFolderRouter from "./routes/thinkfolders";
import actionItemRouter from "./routes/actionitem";
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
// import swaggerOptions from "./utils/swagger_options";

// const specs = swaggerJsdoc(swaggerOptions);
const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello, this is Express + Typescript" });
});

app.use("/thinkfolders", thinkFolderRouter);
app.use("/actionitem", actionItemRouter);

// app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

export default app;
