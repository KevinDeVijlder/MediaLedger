import db from "./db.js";

export function initializeDatabase() {
  db.serialize(() => {
    // ----------- Collections Table -----------
    db.run(`
      CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        cover_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ----------- Platforms Table -----------
    db.run(`
      CREATE TABLE IF NOT EXISTS platforms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    // ----------- Media Types Table -----------
    db.run(`
      CREATE TABLE IF NOT EXISTS media_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    // ----------- Tags Table -----------
    db.run(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `);

    // ----------- Items Table -----------
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT CHECK(type IN ('movie','tvshow','game')) NOT NULL,
        cover_url TEXT,
        release_year INTEGER,
        ownership TEXT, -- JSON array: [{format, platform_id}]
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ----------- Item_ Collections Table (many-to-many) -----------
    db.run(`
      CREATE TABLE IF NOT EXISTS item_collections (
        item_id INTEGER NOT NULL,
        collection_id INTEGER NOT NULL,
        PRIMARY KEY(item_id, collection_id),
        FOREIGN KEY(item_id) REFERENCES items(id),
        FOREIGN KEY(collection_id) REFERENCES collections(id)
      );
    `);

    // ----------- Item_Tags Table (many-to-many) -----------
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

  console.log("Database initialized with updated schema.");
}
