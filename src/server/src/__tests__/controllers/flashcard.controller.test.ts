import { SuccessResponse } from "../../utils/responses";
import { FailureResponse } from "../../utils/responses";
import {
  createFlashcard,
  deleteFlashcard,
  getAllFlashcards,
} from "../../controllers/flashcard.controller";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Logger } from "../../utils/logger";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";
import { Flashcard } from "../../models/flashcard.model";

const flashcardLoggerInstance: Logger = new Logger();

describe("flashcard.controller", () => {
  let db: any;

  beforeAll(async () => {
    db = await open({ filename: ":memory:", driver: sqlite3.Database });
    flashcardLoggerInstance.success(`Database opened in Controller Test File`);

    await db.run(`CREATE TABLE IF NOT EXISTS thinkfolder (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT NOT NULL,
      color TEXT NOT NULL
    )`);

    await db.run(`
      INSERT INTO thinkfolder (name, description, icon, color)
      VALUES ("Test Controller ThinkFolder 1", "Controller Description", "test-icon-start", "#000000")
    `);

    await db.run(`
      INSERT INTO thinkfolder (name, description, icon, color)
      VALUES ("Test Controller ThinkFolder 2", "Another Controller Description","test-icon-next", "#FFFFFF")
    `);

    flashcardLoggerInstance.success(
      `Database populated ThinkFolders in Controller Test File`
    );

    await db.run(`
    CREATE TABLE IF NOT EXISTS thinksession (
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

    await db.run(`
      INSERT INTO thinksession (thinkfolder_id, title, location, date, start_time, end_time, layout)
      VALUES (1, "Test Controller ThinkSession 1", "Test Location A", "2023-10-10", "10:00", "11:00", "[]")
    `);

    await db.run(`
      INSERT INTO thinksession (thinkfolder_id, title, location, date, start_time, end_time, layout)
      VALUES (1, "Test Controller ThinkSession 2", "Test Location B", "2023-11-11", "11:00", "13:00", "[]")
    `);

    await db.run(`
    INSERT INTO thinksession (thinkfolder_id, title, location, date, start_time, end_time, layout)
    VALUES (2, "Test Controller ThinkSession 3", "Test Location C", "2023-12-12", "14:00", "16:00", "[]")
    `);

    flashcardLoggerInstance.success(
      `Database populated ThinkSessions in Controller Test File`
    );
    expect((await db.all(`SELECT * FROM thinksession`)).length).toBe(3);
    // make sure think session ids are 1, 2, 3
    expect((await db.all(`SELECT * FROM thinksession`))[0].id).toBe(1);
    expect((await db.all(`SELECT * FROM thinksession`))[1].id).toBe(2);
    expect((await db.all(`SELECT * FROM thinksession`))[2].id).toBe(3);

    await db.run(`CREATE TABLE IF NOT EXISTS flashcard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      front TEXT,
      back TEXT,
      status TEXT DEFAULT 'new',
      thinksession_id INTEGER NOT NULL,
      thinkfolder_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (thinksession_id) REFERENCES thinksession(id)
      )`);

    await db.run(`
      INSERT INTO flashcard (front, back, thinksession_id, thinkfolder_id)
      VALUES ("Test Flashcard Front 1", "Test Flashcard Back 1", 1, 1)
    `);

    flashcardLoggerInstance.success(
      `Database populated Notes in Controller Test File`
    );

    expect((await db.all(`SELECT * FROM flashcard`)).length).toBe(1);
  });

  afterAll(async () => {
    await db.run(`DELETE FROM flashcard`);
  });

  describe("getAllFlashcards", () => {
    it("should return an array of Flashcards", async () => {
      const result = await getAllFlashcards(1, db);
      expect(Array.isArray(result)).toBe(true);
      expect((result as Flashcard[]).length).toBe(1);
      expect(result).toEqual([
        {
          id: 1,
          front: "Test Flashcard Front 1",
          back: "Test Flashcard Back 1",
          status: "new",
          thinksession_id: 1,
          thinkfolder_id: 1,
          created_at: expect.any(String),
        },
      ]);
    });

    it("should return an empty array if no flashcards exist", async () => {
      const result = await getAllFlashcards(2, db);
      expect(Array.isArray(result)).toBe(true);
      expect((result as Flashcard[]).length).toBe(0);
      expect(result).toEqual([]);
    });

    it("should return a FailureResponse if there is an error", async () => {
      db.all = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const result = await getAllFlashcards(1, db);
      expect(result).toBeInstanceOf(FailureResponse);
      expect((result as FailureResponse).status).toBe(500);
      expect((result as FailureResponse).error).toBe("Error: Database error");
    });
  });

  describe("createFlashcard", () => {
    it("should return a SuccessResponse for a valid thinksession_id", async () => {
      const result = await createFlashcard(
        {
          thinksession_id: 1,
          front: "Test Flashcard Front 2",
          back: "Test Flashcard Back 2",
        },
        db
      );
      expect(result).toEqual(
        new SuccessResponse(201, "Flashcard created with id 2")
      );
    });

    it("should return a FailureResponse for an invalid thinksession_id", async () => {
      const result = await createFlashcard(
        {
          thinksession_id: 123,
          front: "Test Flashcard Front 2",
          back: "Test Flashcard Back 2",
        },
        db
      );
      expect(result).toEqual(
        new FailureResponse(404, "ThinkSession not found")
      );
    });

    it("should return a FailureResponse if there is an error", async () => {
      db.run = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const result = await createFlashcard(
        {
          thinksession_id: 1,
          front: "Test Flashcard Front 2",
          back: "Test Flashcard Back 2",
        },
        db
      );
      expect(result).toBeInstanceOf(FailureResponse);
      expect((result as FailureResponse).status).toBe(500);
      expect((result as FailureResponse).error).toBe("Error: Database error");
    });
  });
});
