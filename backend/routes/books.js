import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer setup for book images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/books";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =========================
   GET all books
========================= */
router.get("/", async (req, res) => {
  try {
    const rows = await db.allAsync(
      `SELECT * FROM books ORDER BY added_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch books:", err);
    res.status(500).json([]);
  }
});

/* =========================
   GET single book
========================= */
router.get("/:id", async (req, res) => {
  try {
    const row = await db.getAsync(
      "SELECT * FROM books WHERE id = ?",
      [req.params.id]
    );

    if (!row) return res.status(404).json({ error: "Book not found" });
    res.json(row);
  } catch (err) {
    console.error("Failed to fetch book:", err);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

/* =========================
   POST create book
========================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      subtitle = null,
      description = null,
      author,
      publisher = null,
      isbn = null,
      page_count = null,
      language = null,
      publication_year = null,
      format = null,
      genre = null,
    } = req.body;

    const cover_url = req.file
      ? req.file.path.replace(/\\/g, "/")
      : null;

    const result = await db.runAsync(
      `
      INSERT INTO books (
        title,
        subtitle,
        description,
        cover_url,
        author,
        publisher,
        isbn,
        page_count,
        language,
        publication_year,
        format,
        genre
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        subtitle,
        description,
        cover_url,
        author,
        publisher,
        isbn,
        page_count,
        language,
        publication_year,
        format,
        genre,
      ]
    );

    res.status(201).json({
      message: "Book created",
      id: result.lastID,
    });
  } catch (err) {
    console.error("Failed to create book:", err);
    res.status(500).json({ error: "Failed to create book" });
  }
});

/* =========================
   PUT update book
========================= */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await db.getAsync(
      "SELECT cover_url FROM books WHERE id = ?",
      [id]
    );
    if (!existing) return res.status(404).json({ error: "Book not found" });

    const {
      title,
      subtitle = null,
      description = null,
      author,
      publisher = null,
      isbn = null,
      page_count = null,
      language = null,
      publication_year = null,
      format = null,
      genre = null,
      in_trash = 0,
    } = req.body;

    let cover_url = existing.cover_url;
    if (req.file) {
      if (cover_url && fs.existsSync(cover_url)) {
        fs.unlinkSync(cover_url);
      }
      cover_url = req.file.path.replace(/\\/g, "/");
    }

    await db.runAsync(
      `
      UPDATE books SET
        title = ?,
        subtitle = ?,
        description = ?,
        cover_url = ?,
        author = ?,
        publisher = ?,
        isbn = ?,
        page_count = ?,
        language = ?,
        publication_year = ?,
        format = ?,
        genre = ?,
        updated_at = datetime('now'),
        in_trash = ?
      WHERE id = ?
      `,
      [
        title,
        subtitle,
        description,
        cover_url,
        author,
        publisher,
        isbn,
        page_count,
        language,
        publication_year,
        format,
        genre,
        in_trash,
        id,
      ]
    );

    res.json({ message: "Book updated" });
  } catch (err) {
    console.error("Failed to update book:", err);
    res.status(500).json({ error: "Failed to update book" });
  }
});

/* =========================
   DELETE book
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await db.getAsync(
      "SELECT cover_url FROM books WHERE id = ?",
      [id]
    );
    if (!existing) return res.status(404).json({ error: "Book not found" });

    if (existing.cover_url && fs.existsSync(existing.cover_url)) {
      fs.unlinkSync(existing.cover_url);
    }

    await db.runAsync("DELETE FROM books WHERE id = ?", [id]);

    res.json({ message: "Book deleted" });
  } catch (err) {
    console.error("Failed to delete book:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

export default router;
