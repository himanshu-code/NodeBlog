import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { API_BASE_URL, getErrorMessage } from "../api";
import { useAuth } from "../hooks/useAuth";
import type { Post } from "../types";

function PostsPage() {
  const { token, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const handleLike = async (postId: string) => {
    if (!token) {
      setError("Please log in to like a post.");
      return;
    }

    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }
      await loadPosts();
    } catch (likeError) {
      setError(likeError instanceof Error ? likeError.message : "Failed to toggle like");
    }
  };

  const handleDelete = async (postId: string) => {
    if (!token) {
      setError("Please log in to delete a post.");
      return;
    }

    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }
      setMessage("Post deleted.");
      await loadPosts();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Failed to delete post",
      );
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Recent Posts</Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        posts.map((post) => (
          <Card key={post._id}>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                By {post.author?.name ?? "Unknown"} | {new Date(post.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body1">{post.content}</Typography>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<FavoriteIcon />}
                size="small"
                onClick={() => handleLike(post._id)}
                disabled={!isAuthenticated}
              >
                Like ({post.likes?.length ?? 0})
              </Button>
              <IconButton
                color="error"
                onClick={() => handleDelete(post._id)}
                disabled={!isAuthenticated}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))
      )}
      {!loading && posts.length === 0 && (
        <Typography color="text.secondary">No posts available yet.</Typography>
      )}
    </Stack>
  );
}

export default PostsPage;
