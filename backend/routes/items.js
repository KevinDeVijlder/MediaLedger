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
    // Fetch all items
    const items = await db.allAsync(`
      SELECT 
        i.*,
        p.name AS platform_name,
        m.name AS media_type_name
      FROM items i
      LEFT JOIN platforms p ON i.platform_id = p.id
      LEFT JOIN media_types m ON i.media_type_id = m.id
    `);

    const itemsWithRelations = [];

    for (const item of items) {
      // Fetch tags
      const tags = await db.allAsync(
        `SELECT t.id, t.name 
         FROM tags t
         INNER JOIN item_tags it ON it.tag_id = t.id
         WHERE it.item_id = ?`,
        [item.id]
      );

      // Fetch collections
      const collections = await db.allAsync(
        `SELECT c.id, c.name 
         FROM collections c
         INNER JOIN item_collections ic ON ic.collection_id = c.id
         WHERE ic.item_id = ?`,
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
    console.error("Failed to fetch items:", err);
    res.status(500).json([]);
  }
});

// POST new item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      type,
      platform_id = null,
      media_type_id = null,
      collection_ids = "[]",
      tag_ids = "[]",
    } = req.body;

    const cover_url = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // Insert item with all required fields
    const result = await db.runAsync(
      `INSERT INTO items (title, type, platform_id, media_type_id, cover_url)
       VALUES (?, ?, ?, ?, ?)`,
      [title, type, platform_id, media_type_id, cover_url]
    );

    const itemId = result.lastID;

    // Link collections
    for (const cid of JSON.parse(collection_ids)) {
      await db.runAsync(
        "INSERT INTO item_collections (item_id, collection_id) VALUES (?, ?)",
        [itemId, cid]
      );
    }

    // Link tags
    for (const tid of JSON.parse(tag_ids)) {
      await db.runAsync(
        "INSERT INTO item_tags (item_id, tag_id) VALUES (?, ?)",
        [itemId, tid]
      );
    }

    res.status(201).json({ message: "Item created", itemId });
  } catch (err) {
    console.error("Failed to add item:", err);
    res.status(500).json({ error: "Failed to create item" });
  }
});


// GET single item
router.get("/:id", async (req, res) => {
  try {
    const item = await db.getAsync(
      "SELECT * FROM items WHERE id = ?",
      [req.params.id]
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const tags = await db.allAsync(
      `
      SELECT t.id, t.name
      FROM tags t
      JOIN item_tags it ON it.tag_id = t.id
      WHERE it.item_id = ?
      `,
      [item.id]
    );

    const collections = await db.allAsync(
      `
      SELECT c.id, c.name
      FROM collections c
      JOIN item_collections ic ON ic.collection_id = c.id
      WHERE ic.item_id = ?
      `,
      [item.id]
    );

    res.json({ ...item, tags, collections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});


// PUT update item
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const itemId = req.params.id;

    const {
      title,
      type,
      platform_id = null,
      media_type_id = null,
      collection_ids = "[]",
      tag_ids = "[]",
    } = req.body;

    // fetch existing item
    const existing = await db.getAsync(
      "SELECT cover_url FROM items WHERE id = ?",
      [itemId]
    );

    if (!existing) {
      return res.status(404).json({ error: "Item not found" });
    }

    let cover_url = existing.cover_url;

    // 🔄 Replace image if new one uploaded
    if (req.file) {
      // delete old image
      if (cover_url && fs.existsSync(cover_url)) {
        fs.unlinkSync(cover_url);
      }
      cover_url = req.file.path.replace(/\\/g, "/");
    }

    // 🔹 Update main item
    await db.runAsync(
      `
      UPDATE items
      SET title = ?, type = ?, platform_id = ?, media_type_id = ?, cover_url = ?
      WHERE id = ?
      `,
      [title, type, platform_id, media_type_id, cover_url, itemId]
    );

    // 🔹 Replace collections
    await db.runAsync("DELETE FROM item_collections WHERE item_id = ?", [itemId]);
    for (const cid of JSON.parse(collection_ids)) {
      await db.runAsync(
        "INSERT INTO item_collections (item_id, collection_id) VALUES (?, ?)",
        [itemId, cid]
      );
    }

    // 🔹 Replace tags
    await db.runAsync("DELETE FROM item_tags WHERE item_id = ?", [itemId]);
    for (const tid of JSON.parse(tag_ids)) {
      await db.runAsync(
        "INSERT INTO item_tags (item_id, tag_id) VALUES (?, ?)",
        [itemId, tid]
      );
    }

    res.json({ message: "Item updated" });
  } catch (err) {
    console.error("Update item failed:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// DELETE an item
router.delete("/:id", async (req, res) => {
  try {
    const itemId = req.params.id;

    // Get the item's cover_url first
    const item = await db.getAsync("SELECT cover_url FROM items WHERE id = ?", [itemId]);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Delete the image file if it exists
    if (item.cover_url) {
      const filePath = path.join(item.cover_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete item from database
    await db.runAsync("DELETE FROM items WHERE id = ?", [itemId]);
    await db.runAsync("DELETE FROM item_tags WHERE item_id = ?", [itemId]);
    await db.runAsync("DELETE FROM item_collections WHERE item_id = ?", [itemId]);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete item failed:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;
