import db from "./db.js";

export function initializeDatabase() {
  db.serialize(() => {
    // Collections
    db.run(`
      CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        cover_url TEXT
      );
    `);

    // Platforms
    db.run(`
      CREATE TABLE IF NOT EXISTS platforms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    // Media Types
    db.run(`
      CREATE TABLE IF NOT EXISTS media_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    // Tags
    db.run(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    // Items
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT CHECK(type IN ('movie','tvshow','game')) NOT NULL,
        platform_id INTEGER,
        media_type_id INTEGER,
        cover_url TEXT,
        FOREIGN KEY(platform_id) REFERENCES platforms(id),
        FOREIGN KEY(media_type_id) REFERENCES media_types(id)
      );
    `);

    // Item <-> Collections
    db.run(`
      CREATE TABLE IF NOT EXISTS item_collections (
        item_id INTEGER NOT NULL,
        collection_id INTEGER NOT NULL,
        PRIMARY KEY(item_id, collection_id),
        FOREIGN KEY(item_id) REFERENCES items(id),
        FOREIGN KEY(collection_id) REFERENCES collections(id)
      );
    `);

    // Item <-> Tags
    db.run(`
      CREATE TABLE IF NOT EXISTS item_tags (
        item_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY(item_id, tag_id),
        FOREIGN KEY(item_id) REFERENCES items(id),
        FOREIGN KEY(tag_id) REFERENCES tags(id)
      );
    `);
  });

  console.log("Database initialized with cleaned schema.");
}
