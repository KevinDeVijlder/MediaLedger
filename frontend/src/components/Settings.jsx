import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Settings() {
  const [tabIndex, setTabIndex] = useState(0);

  // States for each category
  const [platforms, setPlatforms] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [tags, setTags] = useState([]);

  // Input fields
  const [platformInput, setPlatformInput] = useState("");
  const [mediaTypeInput, setMediaTypeInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const API = "http://localhost:3001";

  // Fetch all categories
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([
      fetchData("platforms", setPlatforms),
      fetchData("media-types", setMediaTypes),
      fetchData("tags", setTags),
    ]);
  };

  // Safe fetch for GET endpoints
  const fetchData = async (endpoint, setter) => {
    try {
      const res = await fetch(`${API}/${endpoint}`);
      if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
      const data = await res.json().catch(() => []);
      setter(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setter([]);
    }
  };

  // Add new item (platform, tag, media type)
  const addItem = async (endpoint, value, setter, inputSetter) => {
    if (!value) return;
    try {
      const res = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: value }),
      });
      if (res.ok) {
        inputSetter("");
        await fetchData(endpoint, setter); // Refresh list after add
      } else {
        const errData = await res.json().catch(() => null);
        console.error(`Failed to add ${endpoint}`, errData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete item
  const deleteItem = async (endpoint, id, setter) => {
    try {
      const res = await fetch(`${API}/${endpoint}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData(endpoint, setter); // Refresh list after delete
      } else {
        const errData = await res.json().catch(() => null);
        console.error(`Failed to delete ${endpoint}`, errData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Render a generic list
  const renderList = (items, setter, endpoint) =>
    Array.isArray(items) &&
    items.map((item) => (
      <ListItem
        key={item.id}
        secondaryAction={
          <IconButton onClick={() => deleteItem(endpoint, item.id, setter)}>
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemText primary={item.name} />
      </ListItem>
    ));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ mb: 2 }}>
        <Tab label="Platforms" />
        <Tab label="Media Types" />
        <Tab label="Tags" />
      </Tabs>

      {/* ---------- Platforms Tab ---------- */}
      {tabIndex === 0 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="New Platform"
              value={platformInput}
              onChange={(e) => setPlatformInput(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() =>
                addItem("platforms", platformInput, setPlatforms, setPlatformInput)
              }
            >
              Add
            </Button>
          </Box>
          <List>{renderList(platforms, setPlatforms, "platforms")}</List>
        </Box>
      )}

      {/* ---------- Media Types Tab ---------- */}
      {tabIndex === 1 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="New Media Type"
              value={mediaTypeInput}
              onChange={(e) => setMediaTypeInput(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() =>
                addItem(
                  "media-types",
                  mediaTypeInput,
                  setMediaTypes,
                  setMediaTypeInput
                )
              }
            >
              Add
            </Button>
          </Box>
          <List>{renderList(mediaTypes, setMediaTypes, "media-types")}</List>
        </Box>
      )}

      {/* ---------- Tags Tab ---------- */}
      {tabIndex === 2 && (
        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="New Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => addItem("tags", tagInput, setTags, setTagInput)}
            >
              Add
            </Button>
          </Box>
          <List>{renderList(tags, setTags, "tags")}</List>
        </Box>
      )}
    </Box>
  );
}
