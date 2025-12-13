import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all tags
router.get("/", async (req, res) => {
  try {
    const tags = await db.allAsync("SELECT * FROM tags");
    res.json(tags);
  } catch (err) {
    console.error("Failed to fetch tags:", err);
    res.status(500).json([]);
  }
});

// POST new tag
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });

    await db.runAsync("INSERT INTO tags (name) VALUES (?)", [name]);
    res.status(201).json({ message: "Tag created" });
  } catch (err) {
    console.error("Failed to add tag:", err);
    res.status(500).json({ error: "Failed to add tag" });
  }
});

// DELETE tag
router.delete("/:id", async (req, res) => {
  try {
    await db.runAsync("DELETE FROM tags WHERE id = ?", [req.params.id]);
    res.json({ message: "Tag deleted" });
  } catch (err) {
    console.error("Failed to delete tag:", err);
    res.status(500).json({ error: "Failed to delete tag" });
  }
});

export default router;
