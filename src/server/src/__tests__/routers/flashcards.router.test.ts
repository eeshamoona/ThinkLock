import request from "supertest";
import express from "express";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";
import createFlashcardsRouter from "../../routes/flashcards";
import { getAllFlashcards } from "../../controllers/flashcards.controller";

describe("flashcardsRouter", () => {
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

    await test_db.run(`CREATE TABLE IF NOT EXISTS flashcard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      front TEXT,
      back TEXT,
      status TEXT DEFAULT 'new',
      thinksession_id INTEGER NOT NULL,
      thinkfolder_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (thinksession_id) REFERENCES thinksession(id)
      )`);

    await test_db.run(`
      INSERT INTO flashcard (front, back, thinksession_id, thinkfolder_id)
      VALUES ("Test Flashcard Front 1", "Test Flashcard Back 1", 1, 1)
    `);
    expect((await test_db.all(`SELECT * FROM flashcard`)).length).toBe(1);

    test_app = express();
    test_app.use(express.json());
    test_app.use("/flashcards", createFlashcardsRouter(test_db));
  });

  afterAll(async () => {
    await test_db.close();
  });

  describe("Flashcard Widget", () => {
    it("GET /flashcards should return a 200 status code and a message", async () => {
      const response = await request(test_app).get("/flashcards");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "You have reached the flashcards route"
      );
    });

    it("GET /flashcards/:thinksession_id should return all flashcards in a Think Session", async () => {
      const response = await request(test_app).get("/flashcards/1");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.flashcards)).toBe(true);
      expect(response.body.flashcards.length).toBe(1);
      expect(response.body.flashcards[0].front).toBe("Test Flashcard Front 1");
      expect(response.body.flashcards[0].back).toBe("Test Flashcard Back 1");
    });

    it("GET /flashcards/:thinksession_id should return a 404 status code if the thinksession is not found", async () => {
      const response = await request(test_app).get("/flashcards/999");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("ThinkSession not found");
    });

    it("POST /flashcards/:thinksession_id should return a 200 status code and a message", async () => {
      const response = await request(test_app).post("/flashcards/1").send({
        front: "Test Flashcard Front 2",
        back: "Test Flashcard Back 2",
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Flashcard created with id 2");
    });

    it("POST /flashcards/:thinksession_id should return a 404 status code if the thinksession is not found", async () => {
      const response = await request(test_app).post("/flashcards/999").send({
        front: "Test Flashcard Front 2",
        back: "Test Flashcard Back 2",
      });
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("ThinkSession not found");
    });

    it("PUT /flashcards/:flashcard_id should return a 200 status code and a message", async () => {
      const response = await request(test_app)
        .put("/flashcards/1")
        .send({ front: "Updated Front", back: "Updated Back" });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Flashcard updated with id 1");
    });

    it("PUT /flashcards/:flashcard_id should return a 404 status code if the flashcard is not found", async () => {
      const response = await request(test_app)
        .put("/flashcards/999")
        .send({ front: "Updated Front", back: "Updated Back" });
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Flashcard not found");
    });

    it("DELETE /flashcards/:flashcard_id should return a 200 status code and a message", async () => {
      const response = await request(test_app).delete("/flashcards/1");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Flashcard deleted with id 1");
    });

    it("DELETE /flashcards/:flashcard_id should return a 404 status code if the flashcard is not found", async () => {
      const response = await request(test_app).delete("/flashcards/999");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Flashcard not found");
    });
  });
});
