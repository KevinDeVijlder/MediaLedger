import { Container, Typography, Box, Paper } from "@mui/material";

function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            MediaLedger
          </Typography>

          <Typography>
            Welcome! Your frontend is running with Material UI.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;