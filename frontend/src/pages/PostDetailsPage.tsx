import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../services/api";
import type { Post } from "../types";

export default function PostDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    apiRequest<Post>(`/posts/${id}`)
      .then(setPost)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load post"));
  }, [id]);

  if (error) return <main className="page-center"><p className="error">{error}</p></main>;
  if (!post) return <main className="page-center"><p>Loading post...</p></main>;

  return (
    <main className="page-center">
      <article className="card wide">
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <small>By {post.author?.name || "Unknown"} • {new Date(post.createdAt).toLocaleString()}</small>
      </article>
    </main>
  );
}
