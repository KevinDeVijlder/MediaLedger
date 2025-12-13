import express from "express";
import db from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/items";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await db.allAsync("SELECT * FROM items");

    const itemsWithRelations = [];
    for (const item of items) {
      const tags = await db.allAsync(
        "SELECT t.id, t.name FROM tags t INNER JOIN item_tags it ON it.tag_id = t.id WHERE it.item_id = ?",
        [item.id]
      );

      const collections = await db.allAsync(
        "SELECT c.id, c.name FROM collections c INNER JOIN item_collections ic ON ic.collection_id = c.id WHERE ic.item_id = ?",
        [item.id]
      );

      itemsWithRelations.push({
        ...item,
        tags,
        collections,
      });
    }

    res.json(itemsWithRelations);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// POST new item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      type,
      collection_ids = "[]",
      tag_ids = "[]",
      ownership = "[]",
    } = req.body;

    const cover_url = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const result = await db.runAsync(
      "INSERT INTO items (title, type, cover_url, ownership) VALUES (?, ?, ?, ?)",
      [title, type, cover_url, ownership]
    );

    const itemId = result.lastID;

    // Collections
    for (const cid of JSON.parse(collection_ids)) {
      await db.runAsync(
        "INSERT INTO item_collections (item_id, collection_id) VALUES (?, ?)",
        [itemId, cid]
      );
    }

    // Tags
    for (const tid of JSON.parse(tag_ids)) {
      await db.runAsync(
        "INSERT INTO item_tags (item_id, tag_id) VALUES (?, ?)",
        [itemId, tid]
      );
    }

    res.status(201).json({ message: "Item created", itemId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

export default router;
