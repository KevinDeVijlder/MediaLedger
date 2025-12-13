import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Alert, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { useApp } from "../AppContext";

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerRefresh, notifySuccess } = useApp();
  const API = "http://localhost:3001";

  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/collections/${id}`)
      .then((res) => res.json())
      .then((data) => setCollection(data))
      .catch(() => setError("Failed to load collection."));

    fetch(`${API}/collections/${id}/items`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => setItems([]));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this collection?")) return;
    await fetch(`${API}/collections/${id}`, { method: "DELETE" });
    triggerRefresh();
    notifySuccess("Collection deleted successfully!");
    navigate("/");
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!collection) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">{collection.name}</Typography>
      <Typography sx={{ mb: 2 }}>{collection.description}</Typography>
      <Button variant="contained" color="error" onClick={handleDelete}>
        Delete Collection
      </Button>

      <Typography variant="h6" sx={{ mt: 3 }}>Items in this collection</Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card onClick={() => navigate(`/items/${item.id}`)} sx={{ cursor: "pointer" }}>
              {item.cover_url && <CardMedia component="img" height="200" image={`${API}/${item.cover_url}`} />}
              <CardContent>
                <Typography>{item.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
