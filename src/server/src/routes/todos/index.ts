import express, { Router } from "express";
import { FailureResponse } from "../../utils/responses";
import {
  getAllTodos,
  getTodoById,
  createTodo,
} from "../../controllers/todo.controller";
import { Todo } from "../../models/todo.model";

const todoRouter: Router = express.Router();

todoRouter.get("/", async (req, res) => {
  res.status(200).send({ message: "You have reached the todo route" });
});

todoRouter.get("/all", async (req, res) => {
  try {
    const todos: Todo[] | FailureResponse = await getAllTodos();
    if (todos instanceof FailureResponse) {
      res.status(todos.status).send({ error: todos.error });
    } else {
      res.status(200).send({ todos: todos });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

todoRouter.get("/:id", async (req, res) => {
  try {
    const todo: Todo | FailureResponse = await getTodoById(
      parseInt(req.params.id)
    );
    if (todo instanceof FailureResponse) {
      res.status(todo.status).send({ error: todo.error });
    } else {
      res.status(200).send({ todo: todo });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

todoRouter.post("/create", async (req, res) => {
  try {
    const todo: number | FailureResponse = await createTodo(
      req.body.thinksession_id,
      req.body.thinkfolder_id,
      req.body.description
    );
    if (todo instanceof FailureResponse) {
      res.status(todo.status).send({ error: todo.error });
    } else {
      res.status(200).send({ todo_id: todo });
    }
  } catch (error) {
    res.status(500).send({ error: `${error}` });
  }
});

export default todoRouter;
