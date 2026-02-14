import { useState } from "react";

const emptyPost = { title: "", content: "" };

export default function PostComposer({ onCreate, disabled }) {
  const [postForm, setPostForm] = useState(emptyPost);

  const submitPost = async (event) => {
    event.preventDefault();
    await onCreate(postForm);
    setPostForm(emptyPost);
  };

  return (
    <section className="card">
      <h2>Create Post</h2>
      <form className="stack" onSubmit={submitPost}>
        <input
          required
          placeholder="Post title"
          value={postForm.title}
          onChange={(event) => setPostForm((current) => ({ ...current, title: event.target.value }))}
        />
        <textarea
          required
          rows={4}
          placeholder="Post content"
          value={postForm.content}
          onChange={(event) => setPostForm((current) => ({ ...current, content: event.target.value }))}
        />
        <button type="submit" disabled={disabled}>
          Create Post
        </button>
      </form>
    </section>
  );
}
