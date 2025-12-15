import React from "react";
import { Box, Button, Typography, Grid, Paper } from "@mui/material";
import { LocalMovies, Tv, SportsEsports, Collections } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#FF6D00";
const SECONDARY = "#212121";

function ActionCard({ icon, title, description, onClick }) {
  return (
    <Paper
      onClick={onClick}
      elevation={3}
      sx={{
        cursor: "pointer",
        p: 3,
        borderRadius: 2,
        transition: "transform 0.16s, box-shadow 0.16s",
        '&:hover': { transform: 'translateY(-6px)', boxShadow: 8 },
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderLeft: `6px solid ${PRIMARY}`,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 1.5,
          display: 'grid',
          placeItems: 'center',
          bgcolor: PRIMARY,
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ fontFamily: 'Ubuntu', fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mt: 0.5 }}>
          {description}
        </Typography>
      </Box>

      <Button variant="contained" sx={{ bgcolor: SECONDARY, color: '#fff' }}>
        Create
      </Button>
    </Paper>
  );
}

export default function Create() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Ubuntu', fontWeight: 800 }}>
          Create
        </Typography>
        <Typography sx={{ mt: 1, color: 'text.secondary', maxWidth: 760 }}>
          Use this page to create new entries in the ledger. You can create individual
          items (Movies, TV Shows, or Games) or create Collections to group items together.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ActionCard
            icon={<LocalMovies />}
            title="Movie"
            description="Add a new movie item with details like title, release year, and metadata."
            onClick={() => navigate('/add-item', { state: { type: 'movie' } })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ActionCard
            icon={<Tv />}
            title="TV Show"
            description="Add a TV show entry. You can later attach seasons and episodes."
            onClick={() => navigate('/add-item', { state: { type: 'tv' } })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ActionCard
            icon={<SportsEsports />}
            title="Game"
            description="Add a game entry including platform and release information."
            onClick={() => navigate('/add-item', { state: { type: 'game' } })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ActionCard
            icon={<Collections />}
            title="Collection"
            description="Create a Collection to group items together for easier browsing."
            onClick={() => navigate('/add-collection')}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
