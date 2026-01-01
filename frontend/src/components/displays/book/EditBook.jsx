import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../../AppContext";
import Delete from "@mui/icons-material/Delete";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = "http://localhost:3001";
  const { triggerRefresh, notifySuccess } = useApp();
  const ACCENT = "#FF6D00";

  // Form fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [language, setLanguage] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [format, setFormat] = useState("");
  const [genre, setGenre] = useState("");

  // Image handling
  const [imageFile, setImageFile] = useState(null); // new uploaded file
  const [previewUrl, setPreviewUrl] = useState(null); // currently displayed image

  const [error, setError] = useState(null);

  const fieldSx = {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: ACCENT },
    "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
  };

  // Fetch existing book
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${API}/books/${id}`);
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();

        setTitle(data.title || "");
        setSubtitle(data.subtitle || "");
        setDescription(data.description || "");
        setAuthor(data.author || "");
        setPublisher(data.publisher || "");
        setIsbn(data.isbn || "");
        setPageCount(data.page_count || "");
        setLanguage(data.language || "");
        setPublicationYear(data.publication_year || "");
        setFormat(data.format || "");
        setGenre(data.genre || "");

        // set existing cover image as preview
        if (data.cover_url) {
          const url = data.cover_url.startsWith("http")
            ? data.cover_url
            : `${API}/${data.cover_url}`;
          setPreviewUrl(url);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load book");
      }
    };
    fetchBook();
  }, [id]);

  // Update preview when a new file is selected
  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title) return setError("Title is required.");
    if (!author) return setError("Author is required.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("description", description);
    formData.append("author", author);
    formData.append("publisher", publisher);
    formData.append("isbn", isbn);
    formData.append("page_count", pageCount);
    formData.append("language", language);
    formData.append("publication_year", publicationYear);
    formData.append("format", format);
    formData.append("genre", genre);

    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${API}/books/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Update failed");

      triggerRefresh();
      notifySuccess("Book updated");
      navigate(`/books/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update book");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1300, mx: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Edit Book
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, md: 4 },
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
        }}
      >
        {/* FORM */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 3,
            boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
          }}
        >
          <TextField
            fullWidth
            label="Title"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Subtitle"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Description"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            label="Author"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <TextField
            fullWidth
            label="Publisher"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              label="ISBN"
              size="small"
              sx={{ flex: "1 1 160px", ...fieldSx }}
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <TextField
              type="number"
              label="Pages"
              size="small"
              sx={{ flex: "1 1 120px", ...fieldSx }}
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
            />
            <TextField
              label="Language"
              size="small"
              sx={{ flex: "1 1 140px", ...fieldSx }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
            <TextField
              type="number"
              label="Year"
              size="small"
              sx={{ flex: "1 1 120px", ...fieldSx }}
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              label="Format"
              size="small"
              sx={{ flex: "1 1 200px", ...fieldSx }}
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            />
            <TextField
              label="Genre"
              size="small"
              sx={{ flex: "1 1 200px", ...fieldSx }}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </Box>

          {/* IMAGE UPLOAD */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              component="label"
              sx={{
                bgcolor: ACCENT,
                "&:hover": { bgcolor: "#e65a00" },
                color: "#fff",
              }}
            >
              Upload Cover
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </Button>

            {previewUrl && (
              <IconButton
                size="small"
                onClick={handleRemoveImage}
                sx={{ color: ACCENT }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: ACCENT,
                "&:hover": { bgcolor: "#e65a00" },
                color: "#fff",
              }}
            >
              Update Book
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                borderColor: ACCENT,
                color: ACCENT,
                "&:hover": {
                  backgroundColor: "rgba(255,109,0,0.08)",
                  borderColor: ACCENT,
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        {/* PREVIEW */}
        <Box sx={{ width: { xs: "100%", md: 360 }, maxWidth: "100%" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "160%",
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "rgba(2,6,23,0.15)",
              boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                backgroundImage: previewUrl ? `url(${previewUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!previewUrl && (
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography sx={{ color: "text.secondary" }}>
                    Cover preview
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    Upload a new image to replace
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
