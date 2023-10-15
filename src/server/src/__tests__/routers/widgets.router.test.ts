import request from "supertest";
import express from "express";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";
import createWidgetsRouter from "../../routes/widgets";

describe("widgetsRouter", () => {
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

    expect((await test_db.all(`SELECT * FROM thinkfolder`)).length).toBe(2);

    await test_db.run(`CREATE TABLE IF NOT EXISTS thinksession (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thinkfolder_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      layout TEXT,
      FOREIGN KEY (thinkfolder_id) REFERENCES thinkfolder(id)
      )`);

    await test_db.run(`
      INSERT INTO thinksession (thinkfolder_id, title, location, date, start_time, end_time, layout)
      VALUES (1, "Test Routing ThinkSession 1", "Test Location A", "2023-10-10", "10:00", "11:00", "[]")
    `);

    await test_db.run(`
      INSERT INTO thinksession (thinkfolder_id, title, location, date, start_time, end_time, layout)
      VALUES (1, "Test Routing ThinkSession 2", "Test Location B", "2023-11-11", "11:00", "13:00", "[]")
    `);

    await test_db.run(`
    INSERT INTO thinksession (thinkfolder_id, title, location, date, start_time, end_time, layout)
    VALUES (2, "Test Routing ThinkSession 3", "Test Location C", "2023-12-12", "14:00", "16:00", "[]")
    `);

    expect((await test_db.all(`SELECT * FROM thinksession`)).length).toBe(3);

    await test_db.run(`
    CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thinksession_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (thinksession_id) REFERENCES thinksession(id)
    )`);

    await test_db.run(`
      INSERT INTO notes (thinksession_id, content)
      VALUES (1, "Test Note 1")
    `);

    await test_db.run(`
      INSERT INTO notes (thinksession_id, content)
      VALUES (2, "Test Note 2")
    `);

    expect((await test_db.all(`SELECT * FROM notes`)).length).toBe(2);
    test_app = express();
    test_app.use(express.json());
    test_app.use("/widgets", createWidgetsRouter(test_db));
  });

  afterAll(async () => {
    await test_db.close();
  });

  it("GET /widgets should return a 200 status code and a message", async () => {
    const response = await request(test_app).get("/widgets");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You have reached the widgets route");
  });

  it("GET /widgets/notes/:thinksession_id should return a 200 status code and Notes object ", async () => {
    const response = await request(test_app).get("/widgets/notes/1");
    expect(response.status).toBe(200);
    expect(typeof response.body.notes).toBe("string");
    expect(response.body.notes).toBe("Test Note 1");
  });

  it("GET /widgets/notes/:thinksession_id should return a 404 status code if the note is not found", async () => {
    const response = await request(test_app).get("/widgets/notes/999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("ThinkSession not found");
  });

  it("POST /widgets/notes/:thinksession_id should return a 200 status code and a message", async () => {
    const response = await request(test_app)
      .post("/widgets/notes/3")
      .send({ content: "Test Note 3" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Notes created with id 3");
  });

  it("POST /widgets/notes/:thinksession_id should return a 200 status code and a message", async () => {
    const response = await request(test_app)
      .post("/widgets/notes/3")
      .send({ content: "Test Note 3" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Notes exists already 3");
  });

  it("POST /widgets/notes/:thinksession_id should return a 404 status code if the thinksession is not found", async () => {
    const response = await request(test_app)
      .post("/widgets/notes/999")
      .send({ content: "Test Note 3" });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("ThinkSession not found");
  });

  it("PUT /widgets/notes/:thinksession_id should return a 200 status code and a message", async () => {
    const response = await request(test_app)
      .put("/widgets/notes/1")
      .send({ content: "Test Note 1 Updated" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Notes updated in thinksession 1");

    // Check that the note was updated
    const updatedResponse = await request(test_app).get("/widgets/notes/1");
    expect(updatedResponse.status).toBe(200);
    expect(typeof updatedResponse.body.notes).toBe("string");
    expect(updatedResponse.body.notes).toBe("Test Note 1 Updated");
  });

  it("PUT /widgets/notes/:thinksession_id should return a 404 status code if the thinksession is not found", async () => {
    const response = await request(test_app)
      .put("/widgets/notes/999")
      .send({ content: "Test Note 1 Updated" });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("ThinkSession not found");
  });
});
