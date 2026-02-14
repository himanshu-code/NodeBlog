import { useEffect, useMemo, useState } from "react";
import { AppBar, Box, Container, Snackbar, Toolbar, Typography } from "@mui/material";
import AuthPanel from "./components/AuthPanel";
import PostComposer from "./components/PostComposer";
import PostList from "./components/PostList";
import {
  createPostRequest,
  deletePostRequest,
  getPosts,
  loginUser,
  parseJwt,
  registerUser,
  likePostRequest,
} from "./api";
import type { AuthFormPayload, Post, PostPayload } from "./types";

export default function App() {
  const [token, setToken] = useState<string>(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState<string>(localStorage.getItem("userId") || "");
  const [posts, setPosts] = useState<Post[]>([]);
  const [toast, setToast] = useState<string>("");

  const authStatus = useMemo(
    () => (token ? `Authenticated. User id: ${userId}` : "Not authenticated."),
    [token, userId]
  );

  useEffect(() => {
    void loadPosts();
  }, []);

  const persistToken = (nextToken: string) => {
    const payload = parseJwt(nextToken);
    const nextUserId = payload.id || "";

    setToken(nextToken);
    setUserId(nextUserId);

    localStorage.setItem("token", nextToken);
    localStorage.setItem("userId", nextUserId);
  };

  const loadPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response);
    } catch (error) {
      setToast((error as Error).message);
    }
  };

  const register = async (payload: Required<AuthFormPayload>) => {
    try {
      const response = await registerUser(payload);
      persistToken(response.token);
      setToast("Registered successfully.");
      await loadPosts();
    } catch (error) {
      setToast((error as Error).message);
    }
  };

  const login = async (payload: Pick<AuthFormPayload, "email" | "password">) => {
    try {
      const response = await loginUser(payload);
      persistToken(response.token);
      setToast("Logged in successfully.");
      await loadPosts();
    } catch (error) {
      setToast((error as Error).message);
    }
  };

  const createPost = async (payload: PostPayload) => {
    if (!token) {
      setToast("Login first to create a post.");
      return;
    }

    try {
      await createPostRequest(payload, token);
      setToast("Post created.");
      await loadPosts();
    } catch (error) {
      setToast((error as Error).message);
    }
  };

  const likePost = async (postId: string) => {
    if (!token) {
      setToast("Login first to like posts.");
      return;
    }

    try {
      await likePostRequest(postId, token);
      await loadPosts();
    } catch (error) {
      setToast((error as Error).message);
    }
  };

  const deletePost = async (postId: string) => {
    if (!token) {
      setToast("Login first to delete posts.");
      return;
    }

    try {
      await deletePostRequest(postId, token);
      setToast("Post deleted.");
      await loadPosts();
    } catch (error) {
      setToast((error as Error).message);
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">NodeBlog</Typography>
          <Typography variant="body2" sx={{ ml: 2 }}>
            React + TypeScript + Material UI frontend for existing APIs
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3, display: "grid", gap: 2 }}>
        <AuthPanel authStatus={authStatus} onRegister={register} onLogin={login} />
        <PostComposer disabled={!token} onCreate={createPost} />
        <PostList posts={posts} userId={userId} onRefresh={loadPosts} onLike={likePost} onDelete={deletePost} />
      </Container>

      <Snackbar open={Boolean(toast)} autoHideDuration={2200} message={toast} onClose={() => setToast("")} />
    </Box>
  );
}
