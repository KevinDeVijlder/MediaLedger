import express from "express";
import cors from "cors";
import { initializeDatabase } from "./schema.js";

// Import routers
import platformsRouter from "./routes/platforms.js";
import mediaTypesRouter from "./routes/mediaTypes.js";
import tagsRouter from "./routes/tags.js";
import collectionsRouter from "./routes/collections.js";
import itemsRouter from "./routes/items.js";



const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Route assignments:
app.use("/platforms", platformsRouter);
app.use("/media-types", mediaTypesRouter);
app.use("/tags", tagsRouter);
app.use("/collections", collectionsRouter);
app.use("/items", itemsRouter);

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