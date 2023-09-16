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

const loggerInstance: Logger = new Logger();

describe("thinkfolder.controller", () => {
  let db: any;

  beforeAll(async () => {
    // Open the database and create tables if they do not exist
    try {
      db = await open({
        filename: ":memory:",
        driver: sqlite3.Database,
      });
      loggerInstance.success(`Database opened in Controller Test File`);
    } catch (error) {
      loggerInstance.error(
        `Error opening database: ${error} in Cotroller Test File`
      );
      throw error;
    }

    // Create thinkfolder table
    await db.run(`CREATE TABLE IF NOT EXISTS thinkfolder (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT NOT NULL
    )`);

    await db.run(`
      INSERT INTO thinkfolder (name, description, color)
      VALUES ("Test ThinkFolder 1", "This is a test thinkfolder", "#000000")
    `);
    await db.run(`
      INSERT INTO thinkfolder (name, description, color)
      VALUES ("Test ThinkFolder 2", "This is another test thinkfolder", "#FFFFFF")
    `);

    loggerInstance.success(`Database populated in Controller Test File`);
    //Check that the database is populated
    expect((await db.all(`SELECT * FROM thinkfolder`)).length).toBe(2);
  });

  describe("getAllThinkFolders", () => {
    it("should return an array of thinkfolders", async () => {
      let result = await getAllThinkFolders(db);
      expect(Array.isArray(result)).toBe(true);
      expect((result as Array<ThinkFolder>).length).toBe(2);
      result = result as Array<ThinkFolder>;
      expect(result).toEqual([
        {
          color: "#000000",
          description: "This is a test thinkfolder",
          id: 1,
          name: "Test ThinkFolder 1",
        },
        {
          color: "#FFFFFF",
          description: "This is another test thinkfolder",
          id: 2,
          name: "Test ThinkFolder 2",
        },
      ]);
    });

    it("should return a FailureResponse if there is an error", async () => {
      // Mock the database to throw an error
      db.all = jest.fn().mockRejectedValueOnce(new Error("Database error"));

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
        description: "This is a test thinkfolder",
        id: 1,
        name: "Test ThinkFolder 1",
      });
      expect((result as ThinkFolder).name).toBe("Test ThinkFolder 1");
    });

    it("should return a FailureResponse if the thinkfolder is not found", async () => {
      const result = await getThinkFolderById(999, db);
      expect(result).toBeInstanceOf(FailureResponse);
      // expect(result.status).toBe(404);
      // expect(result.message).toBe("thinkfolder with id 999 not found");
    });

    it("should return a FailureResponse if there is an error", async () => {
      // Mock the database to throw an error
      db.get = jest.fn().mockRejectedValueOnce(new Error("Database error"));

      const result = await getThinkFolderById(1, db);
      expect(result).toBeInstanceOf(FailureResponse);
      // expect(result.status).toBe(500);
      // expect(result.message).toBe("Error: Database error");
    });
  });

  describe("createThinkFolder", () => {
    it("should return the ID of the created thinkfolder", async () => {
      const newThinkFolder: Partial<ThinkFolder> = {
        name: "New ThinkFolder",
        description: "This is a new thinkfolder",
        color: "#123456",
      };
      const result = await createThinkFolder(newThinkFolder, db);
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThan(0);
    });

    it("should return a FailureResponse if the thinkfolder is not created", async () => {
      // Mock the database to return a result without a lastID property
      db.run = jest.fn().mockResolvedValueOnce({});

      const newThinkFolder: Partial<ThinkFolder> = {
        name: "New ThinkFolder",
        description: "This is a new thinkfolder",
        color: "#123456",
      };
      const result = await createThinkFolder(newThinkFolder, db);
      expect(result).toBeInstanceOf(FailureResponse);
      // expect(result.status).toBe(500);
      // expect(result.message).toBe("failed to create thinkfolder");
    });

    it("should return a FailureResponse if there is an error", async () => {
      // Mock the database to throw an error
      db.run = jest.fn().mockRejectedValueOnce(new Error("Database error"));

      const newThinkFolder: Partial<ThinkFolder> = {
        name: "New ThinkFolder",
        description: "This is a new thinkfolder",
        color: "#123456",
      };
      const result = await createThinkFolder(newThinkFolder, db);
      expect(result).toBeInstanceOf(FailureResponse);
      // expect(result.status).toBe(500);
      // expect(result.message).toBe("Error: Database error");
    });
  });
});
