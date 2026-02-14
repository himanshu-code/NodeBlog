import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";

interface AuthResponse {
  token: string;
}

interface Author {
  _id: string;
  name: string;
  email: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: Author;
  likes: string[];
  createdAt: string;
}

type AuthMode = "login" | "register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

const getErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    return payload.message ?? "Request failed";
  } catch {
    return "Request failed";
  }
};

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(localStorage.getItem("blog-token"));

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = useMemo(() => Boolean(token), [token]);

  const loadPosts = async () => {
    setLoadingPosts(true);
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
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const saveToken = (nextToken: string) => {
    localStorage.setItem("blog-token", nextToken);
    setToken(nextToken);
  };

  const clearNotifications = () => {
    setMessage(null);
    setError(null);
  };

  const handleAuth = async (event: FormEvent) => {
    event.preventDefault();
    clearNotifications();
    setBusy(true);

    try {
      const endpoint = authMode === "login" ? "login" : "register";
      const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authMode === "login" ? { email, password } : { name, email, password }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data: AuthResponse = await response.json();
      saveToken(data.token);
      setMessage(`Successfully ${authMode === "login" ? "logged in" : "registered"}.`);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleCreatePost = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      setError("Please log in to create a post.");
      return;
    }

    clearNotifications();
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
      await loadPosts();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create post");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!token) {
      setError("Please log in to like a post.");
      return;
    }

    clearNotifications();
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

  const handleDeletePost = async (postId: string) => {
    if (!token) {
      setError("Please log in to delete a post.");
      return;
    }

    clearNotifications();
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
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete post");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("blog-token");
    setToken(null);
    setMessage("Logged out.");
  };

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", pb: 6 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NodeBlog Frontend
          </Typography>
          <Chip color={isLoggedIn ? "success" : "default"} label={isLoggedIn ? "Authenticated" : "Guest"} />
          {isLoggedIn && (
            <Button color="inherit" sx={{ ml: 2 }} onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack spacing={3}>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Authentication
              </Typography>
              <Tabs value={authMode} onChange={(_, value: AuthMode) => setAuthMode(value)}>
                <Tab value="login" label="Login" />
                <Tab value="register" label="Register" />
              </Tabs>
              <Box component="form" onSubmit={handleAuth} sx={{ mt: 2 }}>
                <Stack spacing={2}>
                  {authMode === "register" && (
                    <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
                  )}
                  <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                  <Button type="submit" variant="contained" disabled={busy}>
                    {authMode === "login" ? "Login" : "Register"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create Post
              </Typography>
              <Box component="form" onSubmit={handleCreatePost}>
                <Stack spacing={2}>
                  <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
                  <TextField
                    label="Content"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    required
                  />
                  <Button type="submit" variant="contained" disabled={busy || !isLoggedIn}>
                    Publish
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="h5">Recent Posts</Typography>
            {loadingPosts ? (
              <CircularProgress />
            ) : (
              posts.map((post) => (
                <Card key={post._id}>
                  <CardContent>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      By {post.author?.name ?? "Unknown"} • {new Date(post.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">{post.content}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<FavoriteIcon />}
                      size="small"
                      onClick={() => handleToggleLike(post._id)}
                      disabled={!isLoggedIn}
                    >
                      Like ({post.likes?.length ?? 0})
                    </Button>
                    <IconButton color="error" onClick={() => handleDeletePost(post._id)} disabled={!isLoggedIn}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))
            )}
            {!loadingPosts && posts.length === 0 && <Typography color="text.secondary">No posts available yet.</Typography>}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
