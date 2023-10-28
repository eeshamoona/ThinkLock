import {
  getAllStudyEventsFromThinkSession,
  addStudyEventToThinkSession,
} from "../../controllers/studyevent.controller";
import { SuccessResponse } from "../../utils/responses";
import { FailureResponse } from "../../utils/responses";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Logger } from "../../utils/logger";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";
import { StudyEvent } from "../../models/studyevent.model";

const studyEventLoggerInstance: Logger = new Logger();

describe("studyevent.controller", () => {
  let db: any;

  beforeAll(async () => {
    db = await open({ filename: ":memory:", driver: sqlite3.Database });
    studyEventLoggerInstance.success(`Database opened in Controller Test File`);
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

    studyEventLoggerInstance.success(
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

    studyEventLoggerInstance.success(
      `Database populated ThinkSessions in Controller Test File`
    );

    expect((await db.all(`SELECT * FROM thinksession`)).length).toBe(3);

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
    INSERT INTO studyevents (thinksession_id, event_type, details, reference_id)
    VALUES (1, "TEST_EVENT_TYPE", "TEST_EVENT_DETAILS", 1)
    `);

    studyEventLoggerInstance.success(
      `Database populated StudyEvents in Controller Test File`
    );
    expect((await db.all(`SELECT * FROM studyevents`)).length).toBe(1);
  });

  afterAll(async () => {
    await db.close();
  });

  describe("getAllStudyEventsFromThinkSession", () => {
    it("should return all study events from a think session", async () => {
      const studyEvents: any = await getAllStudyEventsFromThinkSession(1, db);
      expect(studyEvents.length).toBe(1);
    });

    it("should return a FailureResponse if the think session does not exist", async () => {
      const studyEvents: any = await getAllStudyEventsFromThinkSession(100, db);
      expect(studyEvents instanceof FailureResponse).toBe(true);
    });
  });

  describe("addStudyEventToThinkSession", () => {
    it("should add a study event to a think session", async () => {
      const studyEvent: Partial<StudyEvent> = {
        event_type: "NEW_TEST_EVENT_TYPE",
        details: "NEW_TEST_EVENT_DETAILS",
        reference_id: 1,
      };
      const result: StudyEvent | FailureResponse =
        await addStudyEventToThinkSession(1, studyEvent, db);
      expect(result instanceof FailureResponse).toBe(false);
      expect((result as StudyEvent).thinksession_id).toBe(1);
      expect((result as StudyEvent).event_type).toBe("NEW_TEST_EVENT_TYPE");
      expect((result as StudyEvent).details).toBe("NEW_TEST_EVENT_DETAILS");
      expect((result as StudyEvent).reference_id).toBe(1);
    });
  });
});
