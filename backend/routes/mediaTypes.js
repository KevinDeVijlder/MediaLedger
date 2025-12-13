import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all media types
router.get("/", async (req, res) => {
  try {
    const mediaTypes = await db.allAsync("SELECT * FROM media_types");
    res.json(mediaTypes);
  } catch (err) {
    console.error("Failed to fetch media types:", err);
    res.status(500).json([]);
  }
});

// POST new media type
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });

    await db.runAsync("INSERT INTO media_types (name) VALUES (?)", [name]);
    res.status(201).json({ message: "Media type created" });
  } catch (err) {
    console.error("Failed to add media type:", err);
    res.status(500).json({ error: "Failed to add media type" });
  }
});

// DELETE media type
router.delete("/:id", async (req, res) => {
  try {
    await db.runAsync("DELETE FROM media_types WHERE id = ?", [req.params.id]);
    res.json({ message: "Media type deleted" });
  } catch (err) {
    console.error("Failed to delete media type:", err);
    res.status(500).json({ error: "Failed to delete media type" });
  }
});

export default router;
