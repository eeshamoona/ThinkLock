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
        description TEXT,
        color TEXT NOT NULL,
        icon TEXT NOT NULL
    )`);
    loggerInstance.success(`Table created: thinkfolder`);

    // Create actionitem table
    await db.run(`CREATE TABLE IF NOT EXISTS actionitem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thinksession_id INTEGER,
        thinkfolder_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY (thinkfolder_id) REFERENCES thinkfolder(id)
        FOREIGN KEY (thinksession_id) REFERENCES thinksession(id)
    )`);
    loggerInstance.success(`Table created: actionitem`);

    // Create thinksession table
    await db.run(`CREATE TABLE IF NOT EXISTS thinksession (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thinkfolder_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        duration INTEGER NOT NULL,
        notes TEXT,
        summary TEXT,
        FOREIGN KEY (thinkfolder_id) REFERENCES thinkfolder(id)
    )`);
    loggerInstance.success(`Table created: thinksession`);

    return db;
  } catch (error) {
    loggerInstance.error(`Error opening database: ${error}`);
    throw error;
  }
})();

export default dbPromise;
