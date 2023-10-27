import { SuccessResponse } from "../../utils/responses";
import { FailureResponse } from "../../utils/responses";
import {
  getAllActionItemsByThinkFolderId,
  getActionItemById,
  createActionItem,
  updateActionItem,
  toggleCompletedActionItem,
} from "../../controllers/actionitem.controller";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Logger } from "../../utils/logger";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";
import { ActionItem } from "../../models/actionitem.model";

const actionItemLoggerInstance: Logger = new Logger();

describe("actionitem.controller", () => {
  let db: any;

  beforeAll(async () => {
    db = await open({ filename: ":memory:", driver: sqlite3.Database });
    actionItemLoggerInstance.success(`Database opened in Controller Test File`);

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

    expect((await db.all(`SELECT * FROM thinkfolder`)).length).toBe(2);

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

    actionItemLoggerInstance.success(
      `Database populated ThinkSessions in Controller Test File`
    );

    expect((await db.all(`SELECT * FROM thinksession`)).length).toBe(2);

    await db.run(`
      CREATE TABLE IF NOT EXISTS actionitem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thinksession_id INTEGER,
        thinkfolder_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (thinkfolder_id) REFERENCES thinkfolder(id)
        FOREIGN KEY (thinksession_id) REFERENCES thinksession(id)
        )`);

    await db.run(`
      INSERT INTO actionitem (thinksession_id, thinkfolder_id, title, description, completed)
      VALUES (1, 1, "Test Controller ActionItem 1", "Test Description A", 0)
    `);

    await db.run(`
      INSERT INTO actionitem (thinksession_id, thinkfolder_id, title, description, completed)
      VALUES (2, 1, "Test Controller ActionItem 2", "Test Description B", 0)
    `);

    await db.run(`
      INSERT INTO actionitem (thinksession_id, thinkfolder_id, title, description, completed)
      VALUES (2, 1, "Test Controller ActionItem 3", "Test Description C", 0)
    `);

    actionItemLoggerInstance.success(
      `Database populated ActionItems in Controller Test File`
    );

    expect((await db.all(`SELECT * FROM actionitem`)).length).toBe(3);

    await db.run(`
      CREATE TABLE IF NOT EXISTS studyevents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thinksession_id INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        details TEXT,
        reference_id INTEGER,
        FOREIGN KEY (thinksession_id) REFERENCES thinksession(id)
        )`);

    await db.run(`
      INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id)
      VALUES (1, "actionitem_created", "2023-10-10 10:00:00", "Test Controller ActionItem 1", 1)
    `);

    await db.run(`
      INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id)
      VALUES (2, "actionitem_created", "2023-11-11 11:00:00", "Test Controller ActionItem 2", 2)
    `);

    await db.run(`
      INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id)
      VALUES (2, "actionitem_created", "2023-11-11 11:00:00", "Test Controller ActionItem 3", 3)
    `);

    actionItemLoggerInstance.success(
      `Database populated StudyEvents in Controller Test File`
    );

    expect((await db.all(`SELECT * FROM studyevents`)).length).toBe(3);
  });

  afterAll(async () => {
    await db.close();
    actionItemLoggerInstance.success(`Database closed in Controller Test File`);
  });

  describe("getAllActionItemsByThinkFolderId", () => {
    it("should return all action items by think folder id", async () => {
      const actionItems = await getAllActionItemsByThinkFolderId(1, db);
      expect(actionItems).toEqual([
        {
          id: 1,
          thinksession_id: 1,
          thinkfolder_id: 1,
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
          title: "Test Controller ActionItem 1",
          description: "Test Description A",
          completed: 0,
        },
        {
          id: 2,
          thinksession_id: 2,
          thinkfolder_id: 1,
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
          title: "Test Controller ActionItem 2",
          description: "Test Description B",
          completed: 0,
        },
        {
          id: 3,
          thinksession_id: 2,
          thinkfolder_id: 1,
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
          title: "Test Controller ActionItem 3",
          description: "Test Description C",
          completed: 0,
        },
      ]);
    });

    it("should return a failure response when the think folder id does not exist", async () => {
      const actionItems = await getAllActionItemsByThinkFolderId(100, db);
      expect(actionItems).toEqual(
        new FailureResponse(404, "ThinkFolder not found")
      );
    });

    it("should return a failure response when there is an error", async () => {
      db.all = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const actionItems = await getAllActionItemsByThinkFolderId(1, db);
      expect(actionItems).toEqual(
        new FailureResponse(500, "Error: Database error")
      );
    });
  });

  describe("getActionItemById", () => {
    it("should return the action item by id", async () => {
      const actionItem = await getActionItemById(1, db);
      expect(actionItem).toEqual({
        id: 1,
        thinksession_id: 1,
        thinkfolder_id: 1,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        title: "Test Controller ActionItem 1",
        description: "Test Description A",
        completed: 0,
      });
    });

    it("should return a failure response when the action item id does not exist", async () => {
      const actionItem = await getActionItemById(100, db);
      expect(actionItem).toEqual(
        new FailureResponse(404, "ActionItem 100 not found")
      );
    });

    it("should return a failure response when there is an error", async () => {
      db.get = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const actionItem = await getActionItemById(1, db);
      expect(actionItem).toEqual(
        new FailureResponse(500, "Error: Database error")
      );
    });
  });

  describe("createActionItem", () => {
    it("should return the id of the created action item", async () => {
      const actionItem = await createActionItem(
        {
          thinksession_id: 1,
          thinkfolder_id: 1,
          title: "Test Controller ActionItem 4",
          description: "Test Description D",
        },
        db
      );
      expect(actionItem).toEqual(4);
    });

    it("should return a failure response when there is an error", async () => {
      db.run = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const actionItem = await createActionItem(
        {
          thinksession_id: 1,
          thinkfolder_id: 1,
          title: "Test Controller ActionItem 4",
          description: "Test Description D",
        },
        db
      );
      expect(actionItem).toEqual(
        new FailureResponse(500, "Error: Database error")
      );
    });
  });

  describe("updateActionItem", () => {
    it("should update an action item", async () => {
      const actionItem = await updateActionItem(
        1,
        {
          thinksession_id: 1,
          thinkfolder_id: 1,
          title: "Test Controller ActionItem 1",
          description: "Test Description A",
        },
        db
      );
      expect(actionItem).toEqual(
        new SuccessResponse(200, "Action item with id 1 updated")
      );
    });

    it("should return a failure response when the action item id does not exist", async () => {
      const actionItem = await updateActionItem(
        100,
        {
          thinksession_id: 1,
          thinkfolder_id: 1,
          title: "Test Controller ActionItem 1",
          description: "Test Description A",
        },
        db
      );
      expect(actionItem).toEqual(
        new FailureResponse(404, "ActionItem 100 not found")
      );
    });
  });
});
