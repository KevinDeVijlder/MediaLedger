import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer setup for boardgame images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/boardgames";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET all boardgames
router.get("/", async (req, res) => {
  try {
    const rows = await db.allAsync(`SELECT * FROM boardgames ORDER BY added_at DESC`);
    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch boardgames:", err);
    res.status(500).json([]);
  }
});

// GET single boardgame
router.get("/:id", async (req, res) => {
  try {
    const row = await db.getAsync("SELECT * FROM boardgames WHERE id = ?", [req.params.id]);
    if (!row) return res.status(404).json({ error: "Boardgame not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch boardgame" });
  }
});

// POST create boardgame
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      description = null,
      publisher = null,
      min_players = null,
      max_players = null,
      avg_playtime = null,
      complexity_weight = null,
    } = req.body;

    const cover_url = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const result = await db.runAsync(
      `INSERT INTO boardgames (name, description, cover_url, publisher, min_players, max_players, avg_playtime, complexity_weight)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, cover_url, publisher, min_players, max_players, avg_playtime, complexity_weight]
    );

    res.status(201).json({ message: "Boardgame created", id: result.lastID });
  } catch (err) {
    console.error("Failed to create boardgame:", err);
    res.status(500).json({ error: "Failed to create boardgame" });
  }
});

// PUT update boardgame
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await db.getAsync("SELECT cover_url FROM boardgames WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ error: "Boardgame not found" });

    const {
      name,
      description = null,
      publisher = null,
      min_players = null,
      max_players = null,
      avg_playtime = null,
      complexity_weight = null,
      in_trash = 0,
    } = req.body;

    let cover_url = existing.cover_url;
    if (req.file) {
      if (cover_url && fs.existsSync(cover_url)) fs.unlinkSync(cover_url);
      cover_url = req.file.path.replace(/\\/g, "/");
    }

    await db.runAsync(
      `UPDATE boardgames SET name = ?, description = ?, cover_url = ?, publisher = ?, min_players = ?, max_players = ?, avg_playtime = ?, complexity_weight = ?, updated_at = datetime('now'), in_trash = ? WHERE id = ?`,
      [name, description, cover_url, publisher, min_players, max_players, avg_playtime, complexity_weight, in_trash, id]
    );

    res.json({ message: "Boardgame updated" });
  } catch (err) {
    console.error("Failed to update boardgame:", err);
    res.status(500).json({ error: "Failed to update boardgame" });
  }
});

// DELETE boardgame
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await db.getAsync("SELECT cover_url FROM boardgames WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ error: "Boardgame not found" });

    if (existing.cover_url && fs.existsSync(existing.cover_url)) {
      fs.unlinkSync(existing.cover_url);
    }

    await db.runAsync("DELETE FROM boardgames WHERE id = ?", [id]);

    res.json({ message: "Boardgame deleted" });
  } catch (err) {
    console.error("Failed to delete boardgame:", err);
    res.status(500).json({ error: "Failed to delete boardgame" });
  }
});

export default router;
