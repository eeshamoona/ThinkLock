import request from "supertest";
import express from "express";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";
import createActionItemRouter from "../../routes/actionitems";
import { SuccessResponse } from "../../utils/responses";

describe("actionItemsRouter", () => {
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
    CREATE TABLE IF NOT EXISTS actionitem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thinksession_id INTEGER,
      thinkfolder_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT 0,
      FOREIGN KEY (thinkfolder_id) REFERENCES thinkfolder(id)
      FOREIGN KEY (thinksession_id) REFERENCES thinksession(id)
      )`);

    await test_db.run(`
    INSERT INTO actionitem (thinksession_id, thinkfolder_id, title, description, completed)
    VALUES (1, 1, "Test Controller ActionItem 1", "Test Description A", 0)
  `);

    await test_db.run(`
    INSERT INTO actionitem (thinksession_id, thinkfolder_id, title, description, completed)
    VALUES (2, 1, "Test Controller ActionItem 2", "Test Description B", 0)
  `);

    await test_db.run(`
    INSERT INTO actionitem (thinksession_id, thinkfolder_id, title, description, completed)
    VALUES (2, 1, "Test Controller ActionItem 3", "Test Description C", 0)
  `);

    expect((await test_db.all(`SELECT * FROM actionitem`)).length).toBe(3);

    await test_db.run(`
    CREATE TABLE IF NOT EXISTS studyevents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thinksession_id INTEGER NOT NULL,
      event_type TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      details TEXT,
      reference_id INTEGER,
      FOREIGN KEY (thinksession_id) REFERENCES thinksession(id)
      )`);

    await test_db.run(`
    INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id)
    VALUES (1, "actionitem_created", "2023-10-10 10:00:00", "Test Controller ActionItem 1", 1)
  `);

    await test_db.run(`
    INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id)
    VALUES (2, "actionitem_created", "2023-11-11 11:00:00", "Test Controller ActionItem 2", 2)
  `);

    await test_db.run(`
    INSERT INTO studyevents (thinksession_id, event_type, timestamp, details, reference_id)
    VALUES (2, "actionitem_created", "2023-11-11 11:00:00", "Test Controller ActionItem 3", 3)
  `);

    expect((await test_db.all(`SELECT * FROM studyevents`)).length).toBe(3);
    test_app = express();
    test_app.use(express.json());
    test_app.use("/actionitems", createActionItemRouter(test_db));
  });

  afterAll(async () => {
    await test_db.close();
  });

  describe("ActionItems", () => {
    it("GET /actionitems should return a 200 status code and a message", async () => {
      const response = await request(test_app).get("/actionitems");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "You have reached the action items route"
      );
    });

    it("GET /actionitems/all/thinksession/:thinksession_id should return a 200 status code and an array of action items", async () => {
      const response = await request(test_app).get(
        "/actionitems/all/thinksession/2"
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.actionitems)).toBe(true);
    });

    it("GET /actionitems/all/thinksession/:thinksession_id should return a 404 status code if the thinksession is not found", async () => {
      const response = await request(test_app).get(
        "/actionitems/all/thinksession/999"
      );
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("ThinkSession not found");
    });

    it("GET /actionitems/:id should return a 200 status code and an action item object", async () => {
      const response = await request(test_app).get("/actionitems/1");
      expect(response.status).toBe(200);
      expect(typeof response.body.actionitem).toBe("object");
      expect(response.body.actionitem.title).toBe(
        "Test Controller ActionItem 1"
      );
    });

    it("GET /actionitems/:id should return a 404 status code if the action item is not found", async () => {
      const response = await request(test_app).get("/actionitems/999");
      expect(response.status).toBe(404);
      expect(response.body.error).toBe("ActionItem 999 not found");
    });

    it("POST /actionitems/create should return a 200 status code and the created action item object", async () => {
      const response = await request(test_app)
        .post("/actionitems/create")
        .send({
          thinksession_id: 1,
          thinkfolder_id: 1,
          title: "Test ActionItem 4",
          description: "Test Description D",
        });
      expect(response.status).toBe(200);
      expect(typeof response.body.actionitem).toBe("object");
      expect(response.body.actionitem.title).toBe("Test ActionItem 4");
      expect(response.body.actionitem.description).toBe("Test Description D");
    });
  });
});
