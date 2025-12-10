import express from "express";
import cors from "cors";
import { initializeDatabase } from "./schema.js";

const app = express();
app.use(cors());
app.use(express.json());

// initialize DB schema
initializeDatabase();

// test route
app.get("/", (req, res) => {
  res.json({ message: "MediaLedger backend is running" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});