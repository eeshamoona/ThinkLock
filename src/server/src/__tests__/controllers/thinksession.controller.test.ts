import {
  getAllThinkSessions,
  getThinkSessionById,
  createThinkSession,
  getAllThinkSessionsByThinkFolderId,
  getAllThinkSessionsByDate,
  getThinkSessionHeatMapByYear,
  updateThinkSession,
} from "../../controllers/thinksession.controller";
import { ThinkSession } from "../../models/thinksession.model";
import { FailureResponse } from "../../utils/responses";
import { SuccessResponse } from "../../utils/responses";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Logger } from "../../utils/logger";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";

const thinksessionLoggerInstance: Logger = new Logger();

describe("thinksession.controller", () => {
  let db: any;

  beforeAll(async () => {
    db = await open({ filename: ":memory:", driver: sqlite3.Database });
    thinksessionLoggerInstance.success(
      `Database opened in Controller Test File`
    );

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

    thinksessionLoggerInstance.success(
      `Database populated ThinkSessions in Controller Test File`
    );

    expect((await db.all(`SELECT * FROM thinksession`)).length).toBe(3);
  });

  afterAll(async () => {
    await db.close();
  });

  describe("confirm ThinkFolders exists", () => {
    it("should return a thinkfolder ID", async () => {
      const result = await db.all(`SELECT * FROM thinkfolder`);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe("Test Controller ThinkFolder 1");
      expect(result[1].name).toBe("Test Controller ThinkFolder 2");
    });
  });

  describe("getAllThinkSessions", () => {
    it("should return an array of thinksessions", async () => {
      const result = await getAllThinkSessions(db);
      expect(Array.isArray(result)).toBe(true);
      expect((result as Array<ThinkSession>).length).toBe(3);
      expect(result).toEqual([
        {
          id: 1,
          thinkfolder_id: 1,
          title: "Test Controller ThinkSession 1",
          location: "Test Location A",
          date: "2023-10-10",
          start_time: "10:00",
          end_time: "11:00",
          layout: "[]",
        },
        {
          id: 2,
          thinkfolder_id: 1,
          title: "Test Controller ThinkSession 2",
          location: "Test Location B",
          date: "2023-11-11",
          start_time: "11:00",
          end_time: "13:00",
          layout: "[]",
        },
        {
          id: 3,
          thinkfolder_id: 2,
          title: "Test Controller ThinkSession 3",
          location: "Test Location C",
          date: "2023-12-12",
          start_time: "14:00",
          end_time: "16:00",
          layout: "[]",
        },
      ]);
    });

    it("should return a FailureResponse if there is an error", async () => {
      db.all = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const result = await getAllThinkSessions(db);
      expect(result).toEqual(new FailureResponse(500, "Error: Database error"));
    });
  });

  describe("getThinkSessionById", () => {
    it("should get a thinksession by id", async () => {
      const result = await getThinkSessionById(1, db);
      expect(result).toEqual({
        id: 1,
        thinkfolder_id: 1,
        title: "Test Controller ThinkSession 1",
        location: "Test Location A",
        date: "2023-10-10",
        start_time: "10:00",
        end_time: "11:00",
        layout: "[]",
      });
    });

    it("should return a FailureResponse if the thinksession is not found", async () => {
      const result = await getThinkSessionById(999, db);
      expect(result).toEqual(
        new FailureResponse(404, "thinksession with id 999 not found")
      );
    });

    it("should return a FailureResponse if there is an error", async () => {
      db.get = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const result = await getThinkSessionById(1, db);
      expect(result).toEqual(new FailureResponse(500, "Error: Database error"));
    });
  });

  describe("createThinkSession", () => {
    it("should create a thinksession", async () => {
      const result = await createThinkSession(
        {
          thinkfolder_id: 1,
          title: "Test Controller ThinkSession 3",
          location: "Test Location C",
          date: "2023-12-12",
          start_time: "12:00",
          end_time: "11:00",
        },
        db
      );
      expect(result).toEqual(4);
    });

    it("should return a FailureResponse if it fails to create a thinksession", async () => {
      db.run = jest.fn().mockResolvedValueOnce({} as never);
      const result = await createThinkSession(
        {
          thinkfolder_id: 1,
          title: "Test Controller ThinkSession 3",
          location: "Test Location C",
          date: "2023-12-12",
          start_time: "12:00",
          end_time: "11:00",
        },
        db
      );
      expect(result).toEqual(
        new FailureResponse(500, "failed to create thinksession")
      );
    });

    it("should return a FailureResponse if there is an error", async () => {
      db.run = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const result = await createThinkSession(
        {
          thinkfolder_id: 1,
          title: "Test Controller ThinkSession 3",
          location: "Test Location C",
          date: "2023-12-12",
          start_time: "12:00",
          end_time: "11:00",
        },
        db
      );
      expect(result).toEqual(new FailureResponse(500, "Error: Database error"));
    });
  });
});
