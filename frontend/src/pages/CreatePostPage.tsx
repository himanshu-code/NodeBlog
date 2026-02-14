import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function CreatePostPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await apiRequest("/posts", {
        method: "POST",
        token: token || undefined,
        body: JSON.stringify({ title, content }),
      });
      navigate("/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  return (
    <main className="page-center">
      <form onSubmit={handleSubmit} className="card wide">
        <h1>Create post</h1>
        {error && <p className="error">{error}</p>}
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} required />
        <button type="submit">Publish</button>
      </form>
    </main>
  );
}
