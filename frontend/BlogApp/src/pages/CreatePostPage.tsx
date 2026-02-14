import { FormEvent, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, getErrorMessage } from "../api";
import { useAuth } from "../hooks/useAuth";

function CreatePostPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      setError("Please log in to create a post.");
      return;
    }

    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setTitle("");
      setContent("");
      setMessage("Post created.");
      setTimeout(() => navigate("/posts"), 600);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create post",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create Post
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <TextField
              label="Content"
              multiline
              rows={5}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
            <Button type="submit" variant="contained" disabled={busy}>
              Publish
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CreatePostPage;
