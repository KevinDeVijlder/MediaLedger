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
    if (!name?.trim()) {
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

// GET single collection with full items info
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const collection = await db.getAsync(
      "SELECT * FROM collections WHERE id = ?",
      [id]
    );
    if (!collection) return res.status(404).json({ error: "Collection not found" });

    // Get items in this collection with platform, media type
    const items = await db.allAsync(
      `SELECT i.*, p.name AS platform_name, m.name AS media_type_name
       FROM items i
       LEFT JOIN platforms p ON i.platform_id = p.id
       LEFT JOIN media_types m ON i.media_type_id = m.id
       INNER JOIN item_collections ic ON i.id = ic.item_id
       WHERE ic.collection_id = ?`,
      [id]
    );

    // Fetch tags and collections for each item
    const itemsWithRelations = [];
    for (const item of items) {
      const tags = await db.allAsync(
        `SELECT t.id, t.name
         FROM tags t
         INNER JOIN item_tags it ON it.tag_id = t.id
         WHERE it.item_id = ?`,
        [item.id]
      );

      const collections = await db.allAsync(
        `SELECT c.id, c.name
         FROM collections c
         INNER JOIN item_collections ic ON ic.collection_id = c.id
         WHERE ic.item_id = ?`,
        [item.id]
      );

      itemsWithRelations.push({ ...item, tags, collections });
    }

    res.json({ ...collection, items: itemsWithRelations });
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
    // 🔹 Fetch existing collection
    const existing = await db.getAsync("SELECT cover_url FROM collections WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ error: "Collection not found" });

    let cover_url = existing.cover_url;

    // 🔄 Replace image if new one uploaded
    if (req.file) {
      // delete old image
      if (cover_url && fs.existsSync(cover_url)) {
        fs.unlinkSync(cover_url);
      }
      cover_url = req.file.path.replace(/\\/g, "/");
    }

    // 🔹 Update collection
    await db.runAsync(
      `UPDATE collections
       SET name = ?, description = ?, cover_url = ?
       WHERE id = ?`,
      [name, description, cover_url, id]
    );

    res.json({ message: "Collection updated" });
  } catch (err) {
    console.error("Update collection failed:", err);
    res.status(500).json({ error: "Failed to update collection" });
  }
});


// DELETE collection and remove its items links + image
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const collection = await db.getAsync("SELECT * FROM collections WHERE id = ?", [id]);
    if (collection?.cover_url && fs.existsSync(collection.cover_url)) {
      fs.unlinkSync(collection.cover_url);
    }

    await db.runAsync("DELETE FROM item_collections WHERE collection_id = ?", [id]);
    await db.runAsync("DELETE FROM collections WHERE id = ?", [id]);

    res.json({ message: "Collection deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete collection" });
  }
});

export default router;
