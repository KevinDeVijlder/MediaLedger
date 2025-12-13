import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerRefresh, notifySuccess } = useApp();
  const API = "http://localhost:3001";

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [platformId, setPlatformId] = useState("");
  const [mediaTypeId, setMediaTypeId] = useState("");
  const [collectionIds, setCollectionIds] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  const [platforms, setPlatforms] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);

  // 🔹 Load item + dropdown data
  useEffect(() => {
    async function load() {
      try {
        const item = await fetch(`${API}/items/${id}`).then((r) => r.json());

        setTitle(item.title);
        setType(item.type);
        setPlatformId(item.platform_id ?? "");
        setMediaTypeId(item.media_type_id ?? "");
        setCollectionIds(item.collections.map((c) => c.id));
        setTagIds(item.tags.map((t) => t.id));

        setPlatforms(await fetch(`${API}/platforms`).then((r) => r.json()));
        setMediaTypes(await fetch(`${API}/media-types`).then((r) => r.json()));
        setCollections(await fetch(`${API}/collections`).then((r) => r.json()));
        setTags(await fetch(`${API}/tags`).then((r) => r.json()));
      } catch {
        setError("Failed to load item");
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("platform_id", platformId);
    formData.append("media_type_id", mediaTypeId);
    formData.append("collection_ids", JSON.stringify(collectionIds));
    formData.append("tag_ids", JSON.stringify(tagIds));
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch(`${API}/items/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      setError("Failed to save item");
      return;
    }

    triggerRefresh();
    notifySuccess("Item updated successfully");
    navigate("/");
  };

  // 🔹 Delete item
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`${API}/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");

      triggerRefresh();
      notifySuccess("Item deleted successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Edit Item
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          sx={{ mb: 2 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            input={<OutlinedInput label="Type" />}
          >
            <MenuItem value="movie">Movie</MenuItem>
            <MenuItem value="tvshow">TV Show</MenuItem>
            <MenuItem value="game">Game</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={platformId}
            onChange={(e) => setPlatformId(e.target.value)}
            input={<OutlinedInput label="Platform" />}
          >
            {platforms.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Media Type</InputLabel>
          <Select
            value={mediaTypeId}
            onChange={(e) => setMediaTypeId(e.target.value)}
            input={<OutlinedInput label="Media Type" />}
          >
            {mediaTypes.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Collections */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Collections</InputLabel>
          <Select
            multiple
            value={collectionIds}
            onChange={(e) => setCollectionIds(e.target.value)}
            input={<OutlinedInput label="Collections" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selected.map((id) => {
                  const found = collections.find((c) => c.id === id);
                  return <Chip key={id} label={found?.name} />;
                })}
              </Box>
            )}
          >
            {collections.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tags */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={tagIds}
            onChange={(e) => setTagIds(e.target.value)}
            input={<OutlinedInput label="Tags" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selected.map((id) => {
                  const found = tags.find((t) => t.id === id);
                  return <Chip key={id} label={found?.name} />;
                })}
              </Box>
            )}
          >
            {tags.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Image Upload */}
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" component="label">
            Update Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
          </Button>

          {imageFile && (
            <Typography sx={{ mt: 1 }}>
              Selected file: {imageFile.name}
            </Typography>
          )}
        </Box>


        <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
          Save Changes
        </Button>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleDelete}
        >
          Delete Item
        </Button>
      </form>
    </Box>
  );
}
