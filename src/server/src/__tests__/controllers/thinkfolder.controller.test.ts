import {
  getAllThinkFolders,
  getThinkFolderById,
  createThinkFolder,
} from "../../controllers/thinkfolder.controller";
import { ThinkFolder } from "../../models/thinkfolder.model";
import { FailureResponse } from "../../utils/responses";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Logger } from "../../utils/logger";
import { describe, beforeAll, afterAll, it, expect, jest } from "@jest/globals";

const thinkfolderLoggerInstance: Logger = new Logger();

describe("thinkfolder.controller", () => {
  let db: any;

  beforeAll(async () => {
    db = await open({ filename: ":memory:", driver: sqlite3.Database });
    thinkfolderLoggerInstance.success(
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
      VALUES ("Test Controller ThinkFolder 1", "Router Description", "test-icon-start", "#000000")
    `);

    await db.run(`
      INSERT INTO thinkfolder (name, description, icon, color)
      VALUES ("Test Controller ThinkFolder 2", "Another Router Description","test-icon-next", "#FFFFFF")
    `);

    thinkfolderLoggerInstance.success(
      `Database populated in Controller Test File`
    );
    expect((await db.all(`SELECT * FROM thinkfolder`)).length).toBe(2);
  });

  afterAll(async () => {
    await db.close();
  });

  describe("getAllThinkFolders", () => {
    it("should return an array of thinkfolders", async () => {
      const result = await getAllThinkFolders(db);
      expect(Array.isArray(result)).toBe(true);
      expect((result as Array<ThinkFolder>).length).toBe(2);
      expect(result).toEqual([
        {
          id: 1,
          name: "Test Controller ThinkFolder 1",
          description: "Router Description",
          icon: "test-icon-start",
          color: "#000000",
        },
        {
          id: 2,
          name: "Test Controller ThinkFolder 2",
          description: "Another Router Description",
          icon: "test-icon-next",
          color: "#FFFFFF",
        },
      ]);
    });

    it("should return a FailureResponse if there is an error", async () => {
      db.all = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const result = await getAllThinkFolders(db);
      expect(result).toBeInstanceOf(FailureResponse);
      expect((result as FailureResponse).status).toBe(500);
      expect((result as FailureResponse).error).toBe("Error: Database error");
    });
  });

  describe("getThinkFolderById", () => {
    it("should return a thinkfolder object", async () => {
      const result = await getThinkFolderById(1, db);
      expect(result).toEqual({
        color: "#000000",
        description: "Router Description",
        icon: "test-icon-start",
        id: 1,
        name: "Test Controller ThinkFolder 1",
      });
      expect((result as ThinkFolder).name).toBe(
        "Test Controller ThinkFolder 1"
      );
    });

    it("should return a FailureResponse if the thinkfolder is not found", async () => {
      const result = await getThinkFolderById(999, db);
      expect(result).toBeInstanceOf(FailureResponse);
      expect((result as FailureResponse).status).toBe(404);
      expect((result as FailureResponse).error).toBe(
        "thinkfolder with id 999 not found"
      );
    });

    it("should return a FailureResponse if there is an error", async () => {
      db.get = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const result = await getThinkFolderById(1, db);
      expect(result).toBeInstanceOf(FailureResponse);
      expect((result as FailureResponse).status).toBe(500);
      expect((result as FailureResponse).error).toBe("Error: Database error");
    });
  });

  describe("createThinkFolder", () => {
    it("should return the ID of the created thinkfolder", async () => {
      const newThinkFolder: Partial<ThinkFolder> = {
        name: "New ThinkFolder",
        description: "This is a new thinkfolder",
        icon: "new-test-icon",
        color: "#123456",
      };
      const result = await createThinkFolder(newThinkFolder, db);
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThan(0);
    });

    it("should return a FailureResponse if the thinkfolder is not created", async () => {
      db.run = jest.fn().mockResolvedValueOnce({} as never);
      const newThinkFolder: Partial<ThinkFolder> = {
        name: "New ThinkFolder",
        description: "This is a new thinkfolder",
        icon: "new-test-icon",
        color: "#123456",
      };
      const result = await createThinkFolder(newThinkFolder, db);
      expect(result).toBeInstanceOf(FailureResponse);
      expect((result as FailureResponse).status).toBe(500);
      expect((result as FailureResponse).error).toBe(
        "failed to create thinkfolder"
      );
    });

    it("should return a FailureResponse if there is an error", async () => {
      db.run = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database error") as never);
      const newThinkFolder: Partial<ThinkFolder> = {
        name: "New ThinkFolder",
        description: "This is a new thinkfolder",
        icon: "new-test-icon",
        color: "#123456",
      };
      const result = await createThinkFolder(newThinkFolder, db);
      expect(result).toBeInstanceOf(FailureResponse);
      expect((result as FailureResponse).status).toBe(500);
      expect((result as FailureResponse).error).toBe("Error: Database error");
    });
  });
});
