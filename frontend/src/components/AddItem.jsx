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
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";

export default function AddItem() {
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

  const { triggerRefresh, notifySuccess } = useApp(); // ✅ Correct function
  const navigate = useNavigate();
  const API = "http://localhost:3001";

  useEffect(() => {
    async function loadData() {
      setPlatforms(await fetch(`${API}/platforms`).then((r) => r.json()));
      setMediaTypes(await fetch(`${API}/media-types`).then((r) => r.json()));
      setCollections(await fetch(`${API}/collections`).then((r) => r.json()));
      setTags(await fetch(`${API}/tags`).then((r) => r.json()));
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !type) {
      setError("Title and Type are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("platform_id", platformId);
    formData.append("media_type_id", mediaTypeId);
    formData.append("collection_ids", JSON.stringify(collectionIds));
    formData.append("tag_ids", JSON.stringify(tagIds));
    if (imageFile) formData.append("image", imageFile);

    try {
      const result = await fetch(`${API}/items`, {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        const data = await result.json().catch(() => null);
        setError(data?.error || "Error adding item.");
        return;
      }

      // 🔄 Trigger dashboard refresh and show success
      triggerRefresh();
      notifySuccess("Item added successfully!");
      navigate("/"); // Navigate to dashboard
    } catch (err) {
      console.error(err);
      setError("Error adding item.");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Add New Item
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <TextField
          fullWidth
          label="Title"
          sx={{ mb: 3 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Type */}
        <FormControl fullWidth sx={{ mb: 3 }}>
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

        {/* Platform */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={platformId}
            onChange={(e) => setPlatformId(e.target.value)}
            input={<OutlinedInput label="Platform" />}
          >
            {platforms.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Media Type */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Media Type</InputLabel>
          <Select
            value={mediaTypeId}
            onChange={(e) => setMediaTypeId(e.target.value)}
            input={<OutlinedInput label="Media Type" />}
          >
            {mediaTypes.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Collections */}
        <FormControl fullWidth sx={{ mb: 3 }}>
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
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tags */}
        <FormControl fullWidth sx={{ mb: 3 }}>
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
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Image Upload */}
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" component="label">
            Upload Image
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


        {/* Submit */}
        <Button type="submit" variant="contained" fullWidth>
          Save Item
        </Button>
      </form>
    </Box>
  );
}
