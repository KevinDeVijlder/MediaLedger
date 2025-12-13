import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const platforms = await db.allAsync("SELECT * FROM platforms");
    res.json(platforms);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// POST new
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });

    await db.runAsync("INSERT INTO platforms (name) VALUES (?)", [name]);
    res.status(201).json({ message: "Created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.runAsync("DELETE FROM platforms WHERE id = ?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
