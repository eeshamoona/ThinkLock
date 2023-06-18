import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { Logger } from "./logger";

const DB_NAME: string = "db.sqlite";
const loggerInstance: Logger = new Logger();

/**
 * Open the database and create tables if they do not exist
 */

const dbPromise = (async (): Promise<Database> => {
  try {
    const db = await open({
      filename: DB_NAME,
      driver: sqlite3.Database,
    });
    loggerInstance.success(`Database opened: ${DB_NAME}`);

    // Create thinkfolder table
    await db.run(`CREATE TABLE IF NOT EXISTS thinkfolder (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        color TEXT NOT NULL
    )`);
    loggerInstance.success(`Table created: thinkfolder`);

    return db;
  } catch (error) {
    loggerInstance.error(`Error opening database: ${error}`);
    throw error;
  }
})();

export default dbPromise;
