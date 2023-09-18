import request from "supertest";
import express from "express";
import createThinkFoldersRouter from "../../routes/thinkfolders";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";

describe("thinkFoldersRouter", () => {
  let test_db: any;
  let test_app: any;

  beforeAll(async () => {
    test_db = await open({
      filename: ":memory:",
      driver: sqlite3.Database,
    });

    await test_db.run(`CREATE TABLE IF NOT EXISTS thinkfolder (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT NOT NULL,
      color TEXT NOT NULL
    )`);

    await test_db.run(`
      INSERT INTO thinkfolder (name, description, icon, color)
      VALUES ("Test Routing ThinkFolder 1", "Router Description", "test-icon-start", "#000000")
    `);

    await test_db.run(`
      INSERT INTO thinkfolder (name, description, icon, color)
      VALUES ("Test Routing ThinkFolder 2", "Another Router Description","test-icon-next", "#FFFFFF")
    `);

    test_app = express();
    test_app.use(express.json());
    test_app.use("/thinkfolders", createThinkFoldersRouter(test_db));
  });

  afterAll(async () => {
    await test_db.close();
  });

  it("GET /thinkfolders should return a 200 status code and a message", async () => {
    const response = await request(test_app).get("/thinkfolders");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "You have reached the thinkfolder route"
    );
  });

  it("GET /thinkfolders/all should return a 200 status code and an array of thinkfolders", async () => {
    const response = await request(test_app).get("/thinkfolders/all");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.thinkfolders)).toBe(true);
    expect(response.body.thinkfolders.length).toBe(2);
    expect(response.body.thinkfolders[0].name).toBe(
      "Test Routing ThinkFolder 1"
    );
    expect(response.body.thinkfolders[1].name).toBe(
      "Test Routing ThinkFolder 2"
    );
  });

  it("GET /thinkfolders/:id should return a 200 status code and a thinkfolder object", async () => {
    const response = await request(test_app).get("/thinkfolders/1");
    expect(response.status).toBe(200);
    expect(typeof response.body.thinkfolder).toBe("object");
  });

  it("GET /thinkfolders/:id should return a 404 status code if the thinkfolder is not found", async () => {
    const response = await request(test_app).get("/thinkfolders/999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("thinkfolder with id 999 not found");
  });

  it("GET /thinkfolders/:id should return a 404 status code if the id parameter is not a number", async () => {
    const response = await request(test_app).get("/thinkfolders/abc");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("thinkfolder with id NaN not found");
  });

  it("POST /thinkfolders/create should return a 200 status code and the created thinkfolder object", async () => {
    const newThinkFolder = {
      name: "Test Routing ThinkFolder",
      description: "This is a test thinkfolder in router test file",
      icon: "test-icon",
      color: "#000000",
    };
    const response = await request(test_app)
      .post("/thinkfolders/create")
      .send(newThinkFolder);
    expect(response.status).toBe(200);
    expect(response.body.thinkfolder).toBe(3);
  });

  it("POST /thinkfolders/create should return a 500 status code if the request body is missing required fields", async () => {
    const response = await request(test_app)
      .post("/thinkfolders/create")
      .send({});
    expect(response.status).toBe(500);
    expect(response.body.error).toContain("NOT NULL constraint failed");
  });

  it("GET /thinkfolders/all should return a 500 status code if the database throws an error", async () => {
    // Mock the database to throw an error
    test_db.all = jest
      .fn()
      .mockRejectedValueOnce(new Error("Database error") as never);
    const response = await request(test_app).get("/thinkfolders/all");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error: Database error");
  });

  it("GET /thinkfolders/:id should return a 500 status code if the database throws an error", async () => {
    // Mock the database to throw an error
    test_db.get = jest
      .fn()
      .mockRejectedValueOnce(new Error("Database error") as never);
    const response = await request(test_app).get("/thinkfolders/1");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error: Database error");
  });

  it("POST /thinkfolders/create should return a 500 status code if the database throws an error", async () => {
    // Mock the database to throw an error
    test_db.run = jest
      .fn()
      .mockRejectedValueOnce(new Error("Database error") as never);
    const response = await request(test_app).post("/thinkfolders/create").send({
      name: "Test Routing ThinkFolder",
      description: "This is a test thinkfolder in router test file",
      color: "#000000",
    });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error: Database error");
  });
});
