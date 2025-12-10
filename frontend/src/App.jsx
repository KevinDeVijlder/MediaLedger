import { useEffect, useState } from "react";
import { Container, Typography, Box, Paper, CircularProgress } from "@mui/material";
import { apiGet } from "./api/client";

function App() {
  const [backendMessage, setBackendMessage] = useState(null);

  useEffect(() => {
    apiGet("/")
      .then((data) => {
        setBackendMessage(data.message);
      })
      .catch((err) => {
        setBackendMessage("Error connecting to backend");
        console.error(err);
      });
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            MediaLedger
          </Typography>

          {!backendMessage ? (
            <CircularProgress />
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Backend says: {backendMessage}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default App;