import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Chip
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

export default function AddItemForm({ collections, platforms, tags }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [collectionId, setCollectionId] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [ownership, setOwnership] = useState([{ format: "physical", platformId: "" }]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleAddOwnership = () => {
    setOwnership([...ownership, { format: "physical", platformId: "" }]);
  };

  const handleRemoveOwnership = (index) => {
    const copy = [...ownership];
    copy.splice(index, 1);
    setOwnership(copy);
  };

  const handleOwnershipChange = (index, field, value) => {
    const copy = [...ownership];
    copy[index][field] = value;
    setOwnership(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    if (collectionId) formData.append("collection_id", collectionId);
    if (releaseYear) formData.append("release_year", releaseYear);
    if (coverFile) formData.append("cover", coverFile);
    formData.append("ownership", JSON.stringify(ownership));
    formData.append("tags", JSON.stringify(selectedTags));

    try {
      const res = await fetch("http://localhost:3001/items", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      alert("Item created with ID: " + data.itemId);
      // reset form
      setTitle("");
      setType("movie");
      setCollectionId("");
      setReleaseYear("");
      setCoverFile(null);
      setOwnership([{ format: "physical", platformId: "" }]);
      setSelectedTags([]);
    } catch (err) {
      console.error(err);
      alert("Error creating item");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>Add New Item</Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="movie">Movie</MenuItem>
        <MenuItem value="tvshow">TV Show</MenuItem>
        <MenuItem value="game">Game</MenuItem>
      </TextField>

      <TextField
        select
        label="Collection"
        value={collectionId}
        onChange={(e) => setCollectionId(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="">None</MenuItem>
        {collections.map((c) => (
          <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
        ))}
      </TextField>

      <TextField
        label="Release Year"
        type="number"
        value={releaseYear}
        onChange={(e) => setReleaseYear(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload Cover Image
        <input type="file" hidden onChange={(e) => setCoverFile(e.target.files[0])} />
      </Button>
      {coverFile && <Typography>{coverFile.name}</Typography>}

      <Typography variant="subtitle1" sx={{ mt: 2 }}>Ownership</Typography>
      {ownership.map((o, index) => (
        <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={5}>
            <TextField
              select
              label="Format"
              value={o.format}
              onChange={(e) => handleOwnershipChange(index, "format", e.target.value)}
              fullWidth
            >
              <MenuItem value="physical">Physical</MenuItem>
              <MenuItem value="digital">Digital</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={5}>
            <TextField
              select
              label="Platform"
              value={o.platformId}
              onChange={(e) => handleOwnershipChange(index, "platformId", e.target.value)}
              fullWidth
            >
              <MenuItem value="">Select</MenuItem>
              {platforms.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={2}>
            <IconButton color="error" onClick={() => handleRemoveOwnership(index)}>
              <Remove />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button startIcon={<Add />} onClick={handleAddOwnership} sx={{ mb: 2 }}>
        Add Ownership
      </Button>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Tags</InputLabel>
        <Select
          multiple
          value={selectedTags}
          onChange={(e) => setSelectedTags(e.target.value)}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((id) => {
                const tag = tags.find(t => t.id === id);
                return <Chip key={id} label={tag ? tag.name : id} />;
              })}
            </Box>
          )}
        >
          {tags.map((tag) => (
            <MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary">Create Item</Button>
    </Box>
  );
}
