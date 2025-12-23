import express from "express";
import cors from "cors";
import { initializeDatabase } from "./schema.js";

// Import routers
import collectionsRouter from "./routes/collections.js";
import boardgamesRouter from "./routes/boardgames.js";
import booksRouter from "./routes/books.js";



const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Route assignments:
app.use("/collections", collectionsRouter);
app.use("/boardgames", boardgamesRouter);
app.use("/books", booksRouter);
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