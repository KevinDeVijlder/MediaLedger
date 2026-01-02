import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* =========================
   Multer setup for game images
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/videogames";
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
   GET all videogames
========================= */
router.get("/", async (req, res) => {
  try {
    const rows = await db.allAsync(
      `SELECT * FROM videogames ORDER BY added_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch videogames:", err);
    res.status(500).json([]);
  }
});

/* =========================
   GET single videogame
========================= */
router.get("/:id", async (req, res) => {
  try {
    const row = await db.getAsync(
      "SELECT * FROM videogames WHERE id = ?",
      [req.params.id]
    );

    if (!row) return res.status(404).json({ error: "Videogame not found" });
    res.json(row);
  } catch (err) {
    console.error("Failed to fetch videogame:", err);
    res.status(500).json({ error: "Failed to fetch videogame" });
  }
});

/* =========================
   POST create videogame
========================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description = null,
      developer = null,
      publisher = null,
      release_year = null,
      platform = null,
      genre = null,
      mode = null,
      rating = null,
      ownership_type = null,
      status = null,
    } = req.body;

    const cover_url = req.file
      ? req.file.path.replace(/\\/g, "/")
      : null;

    const result = await db.runAsync(
      `
      INSERT INTO videogames (
        title,
        description,
        cover_url,
        developer,
        publisher,
        release_year,
        platform,
        genre,
        mode,
        rating,
        ownership_type,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        description,
        cover_url,
        developer,
        publisher,
        release_year,
        platform,
        genre,
        mode,
        rating,
        ownership_type,
        status,
      ]
    );

    res.status(201).json({
      message: "Videogame created",
      id: result.lastID,
    });
  } catch (err) {
    console.error("Failed to create videogame:", err);
    res.status(500).json({ error: "Failed to create videogame" });
  }
});

/* =========================
   PUT update videogame
========================= */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await db.getAsync(
      "SELECT cover_url FROM videogames WHERE id = ?",
      [id]
    );
    if (!existing) return res.status(404).json({ error: "Videogame not found" });

    const {
      title,
      description = null,
      developer = null,
      publisher = null,
      release_year = null,
      platform = null,
      genre = null,
      mode = null,
      rating = null,
      ownership_type = null,
      status = null,
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
      UPDATE videogames SET
        title = ?,
        description = ?,
        cover_url = ?,
        developer = ?,
        publisher = ?,
        release_year = ?,
        platform = ?,
        genre = ?,
        mode = ?,
        rating = ?,
        ownership_type = ?,
        status = ?,
        updated_at = datetime('now'),
        in_trash = ?
      WHERE id = ?
      `,
      [
        title,
        description,
        cover_url,
        developer,
        publisher,
        release_year,
        platform,
        genre,
        mode,
        rating,
        ownership_type,
        status,
        in_trash,
        id,
      ]
    );

    res.json({ message: "Videogame updated" });
  } catch (err) {
    console.error("Failed to update videogame:", err);
    res.status(500).json({ error: "Failed to update videogame" });
  }
});

/* =========================
   DELETE videogame
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await db.getAsync(
      "SELECT cover_url FROM videogames WHERE id = ?",
      [id]
    );
    if (!existing) return res.status(404).json({ error: "Videogame not found" });

    if (existing.cover_url && fs.existsSync(existing.cover_url)) {
      fs.unlinkSync(existing.cover_url);
    }

    await db.runAsync("DELETE FROM videogames WHERE id = ?", [id]);

    res.json({ message: "Videogame deleted" });
  } catch (err) {
    console.error("Failed to delete videogame:", err);
    res.status(500).json({ error: "Failed to delete videogame" });
  }
});

export default router;
