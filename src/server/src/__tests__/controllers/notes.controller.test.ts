import {
  getNotes,
  createNotes,
  updateNotes,
} from "../../controllers/notes.controller";
import { SuccessResponse } from "../../utils/responses";
import { FailureResponse } from "../../utils/responses";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Logger } from "../../utils/logger";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";

const notesLoggerInstance: Logger = new Logger();

describe("notes.controller", () => {
  let db: any;

  beforeAll(async () => {
    db = await open({ filename: ":memory:", driver: sqlite3.Database });
    notesLoggerInstance.success(`Database opened in Controller Test File`);

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

    notesLoggerInstance.success(
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

    notesLoggerInstance.success(
      `Database populated ThinkSessions in Controller Test File`
    );
    expect((await db.all(`SELECT * FROM thinksession`)).length).toBe(3);
    // make sure think session ids are 1, 2, 3
    expect((await db.all(`SELECT * FROM thinksession`))[0].id).toBe(1);
    expect((await db.all(`SELECT * FROM thinksession`))[1].id).toBe(2);
    expect((await db.all(`SELECT * FROM thinksession`))[2].id).toBe(3);

    await db.run(`CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thinksession_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (thinksession_id) REFERENCES thinksession(id)
    )`);

    await db.run(`
      INSERT INTO notes (thinksession_id, content)
      VALUES (1, "Test Notes Content 1")
    `);

    await db.run(`
      INSERT INTO notes (thinksession_id, content)
      VALUES (2, "Test Notes Content 2")
    `);

    notesLoggerInstance.success(
      `Database populated Notes in Controller Test File`
    );
  });

  afterAll(async () => {
    await db.run(`DELETE FROM notes`);
  });

  describe("getNotes", () => {
    it("should return the notes for a valid thinksession_id", async () => {
      const result = await getNotes(1, db);
      expect(typeof result).toBe("string");
      expect(result).toBe("Test Notes Content 1");
    });

    it("should return a FailureResponse for an invalid thinksession_id", async () => {
      const result = await getNotes(123, db);
      expect(result).toEqual(new FailureResponse(404, "ThinkSession not found"));
    });
  });

  describe("createNotes", () => {
    it("should return a SuccessResponse for a valid thinksession_id if notes does not exist", async () => {
      const result = await createNotes(3, db);
      expect(result).toEqual(
        new SuccessResponse(201, "Notes created with id 3")
      );
    });

    it("should return a SuccessResponse for a valid thinksession_id if notes already exists", async () => {
      const result = await createNotes(2, db);
      expect(result).toEqual(
        new SuccessResponse(201, "Notes exists already 2")
      );
    });

    it("should return a FailureResponse for an invalid thinksession_id", async () => {
      const result = await createNotes(123, db);
      expect(result).toEqual(
        new FailureResponse(404, "ThinkSession not found")
      );
    });
  });
});
