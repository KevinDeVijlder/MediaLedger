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

// GET single collection with its items
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const collection = await db.getAsync(
      "SELECT * FROM collections WHERE id = ?",
      [id]
    );
    if (!collection) return res.status(404).json({ error: "Collection not found" });

    // Get items in this collection
    const items = await db.allAsync(
      `SELECT i.* FROM items i
       INNER JOIN item_collections ic ON i.id = ic.item_id
       WHERE ic.collection_id = ?`,
      [id]
    );

    res.json({ ...collection, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
});

// PUT update collection
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, description = "" } = req.body;

  try {
    const cover_url = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const fields = ["name = ?", "description = ?"];
    const params = [name, description];

    if (cover_url) {
      fields.push("cover_url = ?");
      params.push(cover_url);
    }

    params.push(id);

    await db.runAsync(`UPDATE collections SET ${fields.join(", ")} WHERE id = ?`, params);

    res.json({ message: "Collection updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update collection" });
  }
});

// DELETE collection and remove item links
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.runAsync("DELETE FROM item_collections WHERE collection_id = ?", [id]);
    await db.runAsync("DELETE FROM collections WHERE id = ?", [id]);
    res.json({ message: "Collection deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete collection" });
  }
});


export default router;
