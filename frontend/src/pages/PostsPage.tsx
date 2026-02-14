import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import type { Post } from "../types";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<Post[]>("/posts")
      .then(setPosts)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load posts"));
  }, []);

  return (
    <main className="page-list">
      <h1>Recent posts</h1>
      {error && <p className="error">{error}</p>}
      {posts.length === 0 && !error && <p>No posts yet.</p>}
      <div className="post-grid">
        {posts.map((post) => (
          <article key={post._id} className="card">
            <h2>{post.title}</h2>
            <p>{post.content.slice(0, 120)}...</p>
            <small>By {post.author?.name || "Unknown"}</small>
            <Link to={`/posts/${post._id}`}>Read full post</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
