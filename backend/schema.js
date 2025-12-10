
import db from "./db.js";

export function initializeDatabase() {
  db.serialize(() => {
    // Collections table (Marvel, LOTR, etc.)
    db.run(`
      CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    // Items table (movies, games)
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT CHECK(type IN ('movie', 'game')) NOT NULL,
        format TEXT CHECK(format IN ('digital', 'physical')) NOT NULL,
        collection_id INTEGER,
        FOREIGN KEY(collection_id) REFERENCES collections(id)
      );
    `);
  });

  console.log("Database initialized.");
}