import request from "supertest";
import express from "express";
import createThinkSessionRouter from "../../routes/thinksessions";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";

describe("thinkSessionsRouter", () => {
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

    await test_db.run(`
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

    test_app = express();
    test_app.use(express.json());
    test_app.use("/thinksessions", createThinkSessionRouter(test_db));
  });

  afterAll(async () => {
    await test_db.close();
  });

  it("GET /thinksessions should return a 200 status code and a message", async () => {
    const response = await request(test_app).get("/thinksessions");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "You have reached the thinksession route"
    );
  });

  it("GET /thinksessions/all should return a 200 status code and an array of thinksessions", async () => {
    const response = await request(test_app).get("/thinksessions/all");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.thinksessions)).toBe(true);
    expect(response.body.thinksessions.length).toBe(3);
    expect(response.body.thinksessions[0].title).toBe(
      "Test Routing ThinkSession 1"
    );
    expect(response.body.thinksessions[1].title).toBe(
      "Test Routing ThinkSession 2"
    );
    expect(response.body.thinksessions[2].title).toBe(
      "Test Routing ThinkSession 3"
    );
  });

  it("GET /thinksessions/:id should return a 200 status code and a thinksession object", async () => {
    const response = await request(test_app).get("/thinksessions/1");
    expect(response.status).toBe(200);
    expect(typeof response.body.thinksession).toBe("object");
    expect(response.body.thinksession.title).toBe(
      "Test Routing ThinkSession 1"
    );
  });

  it("GET /thinksessions/:id should return a 404 status code if the thinksession is not found", async () => {
    const response = await request(test_app).get("/thinksessions/999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("thinksession with id 999 not found");
  });

  it("GET /thinksessions/all/:thinkfolder_id should return a 200 status code and an array of thinksessions", async () => {
    const response = await request(test_app).get("/thinksessions/all/1");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.thinksessions)).toBe(true);
    expect(response.body.thinksessions.length).toBe(2);
    expect(response.body.thinksessions[0].title).toBe(
      "Test Routing ThinkSession 1"
    );
    expect(response.body.thinksessions[1].title).toBe(
      "Test Routing ThinkSession 2"
    );

    // Test a different thinkfolder_id
    const response2 = await request(test_app).get("/thinksessions/all/2");
    expect(response2.status).toBe(200);
    expect(Array.isArray(response2.body.thinksessions)).toBe(true);
    expect(response2.body.thinksessions.length).toBe(1);
    expect(response2.body.thinksessions[0].title).toBe(
      "Test Routing ThinkSession 3"
    );
  });

  it("PUT /thinksessions/create should return a 200 status code and the created thinksession object", async () => {
    const newThinkSession = {
      thinkfolder_id: 1,
      title: "Test Create ThinkSession",
      location: "Test Location",
      date: "2023-01-01",
      start_time: "10:00",
      end_time: "11:00",
      layout: "[]",
    };
    const response = await request(test_app)
      .post("/thinksessions/create")
      .send(newThinkSession);
    expect(response.status).toBe(200);
    expect(response.body.thinksession_id).toBe(4);

    // Check that the thinksession was actually created
    const response2 = await request(test_app).get("/thinksessions/4");
    expect(response2.status).toBe(200);
    expect(response2.body.thinksession.title).toBe("Test Create ThinkSession");
  });
});
