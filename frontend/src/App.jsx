import { useEffect, useMemo, useState } from "react";
import AuthPanel from "./components/AuthPanel";
import PostComposer from "./components/PostComposer";
import PostList from "./components/PostList";
import { apiRequest, parseJwt } from "./api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [posts, setPosts] = useState([]);
  const [toast, setToast] = useState("");

  const authStatus = useMemo(
    () => (token ? `Authenticated. User id: ${userId}` : "Not authenticated."),
    [token, userId]
  );

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timerId = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timerId);
  }, [toast]);

  const persistToken = (nextToken) => {
    const payload = parseJwt(nextToken);
    const nextUserId = payload.id || "";

    setToken(nextToken);
    setUserId(nextUserId);

    localStorage.setItem("token", nextToken);
    localStorage.setItem("userId", nextUserId);
  };

  const loadPosts = async () => {
    try {
      const response = await apiRequest("/api/posts");
      setPosts(response);
    } catch (error) {
      setToast(error.message);
    }
  };

  const register = async (payload) => {
    try {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      persistToken(response.token);
      setToast("Registered successfully.");
      await loadPosts();
    } catch (error) {
      setToast(error.message);
    }
  };

  const login = async (payload) => {
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      persistToken(response.token);
      setToast("Logged in successfully.");
      await loadPosts();
    } catch (error) {
      setToast(error.message);
    }
  };

  const createPost = async (payload) => {
    if (!token) {
      setToast("Login first to create a post.");
      return;
    }

    try {
      await apiRequest("/api/posts", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
      });
      setToast("Post created.");
      await loadPosts();
    } catch (error) {
      setToast(error.message);
    }
  };

  const likePost = async (postId) => {
    if (!token) {
      setToast("Login first to like posts.");
      return;
    }

    try {
      await apiRequest(`/api/posts/${postId}/like`, {
        method: "POST",
        token,
      });
      await loadPosts();
    } catch (error) {
      setToast(error.message);
    }
  };

  const deletePost = async (postId) => {
    if (!token) {
      setToast("Login first to delete posts.");
      return;
    }

    try {
      await apiRequest(`/api/posts/${postId}`, {
        method: "DELETE",
        token,
      });
      setToast("Post deleted.");
      await loadPosts();
    } catch (error) {
      setToast(error.message);
    }
  };

  return (
    <>
      <header>
        <h1>NodeBlog</h1>
        <p>React + Vite frontend connected to the NodeBlog APIs.</p>
      </header>

      <main>
        <AuthPanel authStatus={authStatus} onRegister={register} onLogin={login} />
        <PostComposer disabled={!token} onCreate={createPost} />
        <PostList
          posts={posts}
          userId={userId}
          onRefresh={loadPosts}
          onLike={likePost}
          onDelete={deletePost}
        />
      </main>

      {toast && <p className="toast">{toast}</p>}
    </>
  );
}
