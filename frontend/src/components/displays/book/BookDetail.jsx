import { Box, Typography, Button, Chip, Alert, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../../AppContext";

import CreateIcon from "@mui/icons-material/Create";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TranslateIcon from "@mui/icons-material/Translate";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = "http://localhost:3001";
  const { triggerRefresh, notifySuccess } = useApp();

  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  const ACCENT = "#FF6D00";

  useEffect(() => {
    async function load() {
      try {
        const data = await fetch(`${API}/books/${id}`).then((r) =>
          r.json()
        );
        setBook(data);
      } catch {
        setError("Failed to load book");
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this book?")) return;
    try {
      const res = await fetch(`${API}/books/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();

      triggerRefresh();
      notifySuccess("Book deleted");
      navigate("/books");
    } catch {
      setError("Failed to delete book");
    }
  };

  if (!book) {
    return (
      <Box sx={{ p: 3 }}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography>Loading…</Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1300, mx: "auto" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {book.title}
          </Typography>

          {book.subtitle && (
            <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
              {book.subtitle}
            </Typography>
          )}

          {book.author && (
            <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
              by {book.author}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/books/${id}/edit`)}
            sx={{
              bgcolor: ACCENT,
              "&:hover": { bgcolor: "#e65a00" },
            }}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleDelete}
            sx={{
              borderColor: ACCENT,
              color: ACCENT,
              "&:hover": {
                backgroundColor: "rgba(255,109,0,0.08)",
                borderColor: ACCENT,
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* MAIN CARD */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, md: 4 },
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
          p: { xs: 2, md: 3 },
        }}
      >
        {/* COVER */}
        <Box sx={{ width: { xs: "100%", md: 320 } }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "160%", // book ratio
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "rgba(2,6,23,0.15)",
              boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
            }}
          >
            {book.cover_url ? (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${API}/${book.cover_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
                  }}
                />

                {/* SPINE SHADOW */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 12,
                    background: `
                      linear-gradient(
                        to right,
                        rgba(0,0,0,0.28),
                        rgba(0,0,0,0.12),
                        rgba(0,0,0,0.02)
                      )
                    `,
                    pointerEvents: "none",
                  }}
                />
              </>
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  px: 2,
                }}
              >
                <Typography sx={{ color: "text.secondary" }}>
                  No cover image
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* DETAILS */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* META */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            {book.page_count != null && (
              <Chip
                icon={<MenuBookIcon />}
                label={`${book.page_count} pages`}
              />
            )}

            {book.language && (
              <Chip
                icon={<TranslateIcon />}
                label={book.language}
              />
            )}

            {book.publisher && (
              <Chip
                icon={<LocalLibraryIcon />}
                label={book.publisher}
              />
            )}

            {book.publication_year && (
              <Chip
                icon={<CalendarTodayIcon />}
                label={`${book.publication_year}`}
              />
            )}

            {book.genre && (
              <Chip
                label={book.genre}
                color="primary"
              />
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* DESCRIPTION */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Description
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
            {book.description || "No description provided."}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
