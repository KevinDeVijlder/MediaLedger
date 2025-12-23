import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../AppContext";

import PersonIcon from "@mui/icons-material/Person";
import FactoryIcon from "@mui/icons-material/Factory";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TranslateIcon from "@mui/icons-material/Translate";

export default function Books() {
  const API = "http://localhost:3001";
  const navigate = useNavigate();
  const { refreshToken, successMessage } = useApp();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/books`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, [refreshToken]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1300, mx: "auto" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Books
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/books/add")}
          sx={{
            bgcolor: "#FF6D00",
            color: "#fff",
            fontWeight: 700,
            "&:hover": { bgcolor: "#e65a00" },
          }}
        >
          Add Book
        </Button>
      </Box>

      {items.length === 0 && <Typography>No books found.</Typography>}

      {successMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* GRID */}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 3, md: 4 },
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {items.map((item) => (
          <Box key={item.id} sx={{ display: "flex", justifyContent: "center" }}>
            <BookCard
              item={item}
              api={API}
              onClick={() => navigate(`/books/${item.id}`)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function BookCard({ item, api, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
        transition: "box-shadow 220ms, transform 180ms",
        "&:hover": {
          boxShadow: "0 24px 60px rgba(2,6,23,0.16)",
        },
      }}
    >
      {/* COVER */}
      <Box sx={{ width: "100%", paddingTop: "100%", position: "relative", bgcolor: "grey.100" }}>
        {item.cover_url ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${api}/${item.cover_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              px: 2,
              color: "text.secondary",
            }}
          >
            <Typography>No cover image</Typography>
          </Box>
        )}

        {/* GENRE BADGE */}
        {item.genre && (
          <Chip
            label={item.genre}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      {/* DETAILS */}
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }} noWrap>
          {item.title}
        </Typography>

        {item.subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ mb: 0.5 }}
          >
            {item.subtitle}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          <PersonIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          {item.author}
        </Typography>

        {item.publisher && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            <FactoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            {item.publisher}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          <MenuBookIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          {item.page_count != null ? `${item.page_count} pages` : "-"}
        </Typography>

        {item.language && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            <TranslateIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            {item.language}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
