import express from "express";
import db from "../db.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/collections";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET all collections
router.get("/", async (req, res) => {
  try {
    const collections = await db.allAsync("SELECT * FROM collections");
    res.json(collections);
  } catch (err) {
    console.error("Failed to fetch collections:", err);
    res.status(500).json([]);
  }
});

// POST new collection with optional image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description = "" } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    const cover_url = req.file ? req.file.path.replace(/\\/g, "/") : null;

    await db.runAsync(
      "INSERT INTO collections (name, description, cover_url) VALUES (?, ?, ?)",
      [name.trim(), description, cover_url]
    );

    res.status(201).json({ message: "Collection created" });
  } catch (err) {
    console.error("Failed to add collection:", err);
    res.status(500).json({ error: "Failed to add collection" });
  }
});

// DELETE collection
router.delete("/:id", async (req, res) => {
  try {
    await db.runAsync("DELETE FROM collections WHERE id = ?", [req.params.id]);
    res.json({ message: "Collection deleted" });
  } catch (err) {
    console.error("Failed to delete collection:", err);
    res.status(500).json({ error: "Failed to delete collection" });
  }
});

export default router;
