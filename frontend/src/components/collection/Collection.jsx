import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../AppContext";

export default function Collections() {
  const API = "http://localhost:3001";
  const navigate = useNavigate();

  // 🔹 Global app context
  const { refreshToken, successMessage, clearSuccess } = useApp();

  // 🔹 Data
  const [collections, setCollections] = useState([]);

  // 🔄 Fetch collections (runs on refreshToken change)
  useEffect(() => {
    fetch(`${API}/collections`)
      .then((res) => res.json())
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .catch(() => setCollections([]));
  }, [refreshToken]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Collections
      </Typography>

      {/* 🔔 Success message */}
      {successMessage && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={clearSuccess}>
          {successMessage}
        </Alert>
      )}

      {collections.length === 0 ? (
        <Typography>No collections found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {collections.map((collection) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={`collection-${collection.id}`}
            >
              <Card
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/collections/${collection.id}`)}
              >
                {collection.cover_url ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${API}/${collection.cover_url}`}
                    alt={collection.name}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="subtitle1">
                      {collection.name}
                    </Typography>
                  </Box>
                )}

                <CardContent>
                  <Typography variant="h6">
                    {collection.name}
                  </Typography>

                  {collection.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {collection.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
