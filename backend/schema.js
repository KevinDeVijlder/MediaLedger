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

    //Videogames
    db.run(`
      CREATE TABLE IF NOT EXISTS videogames (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        cover_url TEXT,
        developer TEXT,
        publisher TEXT,
        release_year INTEGER,
        platform TEXT,          
        genre TEXT,             
        mode TEXT,              
        rating REAL,
        ownership_type TEXT,
        status TEXT,           
        added_at DATETIME DEFAULT (datetime('now')),
        updated_at DATETIME,
        in_trash INTEGER DEFAULT 0
      );
    `);

    // Books
    db.run(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        cover_url TEXT,
        author TEXT NOT NULL,
        publisher TEXT,
        isbn TEXT,
        page_count INTEGER,
        language TEXT,
        publication_year INTEGER,
        format TEXT,          -- paperback, hardcover, ebook, audiobook
        genre TEXT,           -- fantasy, sci-fi, non-fiction, etc.
        added_at DATETIME DEFAULT (datetime('now')),
        updated_at DATETIME,
        in_trash INTEGER DEFAULT 0
      );
    `);

    // Boardgames
    db.run(`
      CREATE TABLE IF NOT EXISTS boardgames (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        cover_url TEXT,
        publisher TEXT,
        min_players INTEGER,
        max_players INTEGER,
        avg_playtime INTEGER,
        complexity_weight REAL,
        added_at DATETIME DEFAULT (datetime('now')),
        updated_at DATETIME,
        in_trash INTEGER DEFAULT 0
      );
    `);
  });

  console.log("Database initialized with cleaned schema.");
}
