import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import { useApp } from "../AppContext";

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerRefresh, notifySuccess } = useApp();
  const API = "http://localhost:3001";

  const [collection, setCollection] = useState(null);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // 🔹 Load collection + its items
  useEffect(() => {
    async function loadCollection() {
      try {
        const colData = await fetch(`${API}/collections/${id}`).then(r => r.json());
        setCollection(colData);
        setName(colData.name);
        setDescription(colData.description || "");
      } catch {
        setError("Failed to load collection.");
      }
    }
    loadCollection();
  }, [id]);

  // 🔹 Update collection
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${API}/collections/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        setError("Failed to update collection.");
        return;
      }

      triggerRefresh();
      notifySuccess("Collection updated successfully!");
      navigate("/");
    } catch {
      setError("Failed to update collection.");
    }
  };

  // 🔹 Delete collection
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this collection?")) return;
    try {
      const res = await fetch(`${API}/collections/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete collection.");
        return;
      }
      triggerRefresh();
      notifySuccess("Collection deleted successfully!");
      navigate("/");
    } catch {
      setError("Failed to delete collection.");
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!collection) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>Edit Collection</Typography>

      {collection.cover_url && (
        <Box
          component="img"
          src={`${API}/${collection.cover_url}`}
          sx={{ width: "100%", maxHeight: 300, objectFit: "cover", mb: 2 }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <Button component="label" variant="outlined" sx={{ mb: 2 }}>
          Replace Image
          <input type="file" hidden onChange={e => setImageFile(e.target.files[0])} />
        </Button>
        <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
          Save Changes
        </Button>
      </form>

      <Button variant="contained" color="error" onClick={handleDelete}>
        Delete Collection
      </Button>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Items in this collection</Typography>
      {(!collection.items || collection.items.length === 0) && (
        <Typography>No items found in this collection.</Typography>
      )}

      <Grid container spacing={3}>
        {collection.items?.map(item => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ cursor: "pointer" }} onClick={() => navigate(`/items/${item.id}`)}>
              {item.cover_url ? (
                <CardMedia component="img" height="200" image={`${API}/${item.cover_url}`} alt={item.title} />
              ) : (
                <Box sx={{ height: 200, bgcolor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography>{item.title}</Typography>
                </Box>
              )}
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                {item.type && <Typography variant="body2" color="text.secondary">Type: {item.type}</Typography>}
                {item.platform_name && <Typography variant="body2" color="text.secondary">Platform: {item.platform_name}</Typography>}
                {item.media_type_name && <Typography variant="body2" color="text.secondary">Media: {item.media_type_name}</Typography>}
                {item.tags?.length > 0 && (
                  <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {item.tags.map(t => <Chip key={t.id} label={t.name} size="small" />)}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
