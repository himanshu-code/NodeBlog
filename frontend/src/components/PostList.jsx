export default function PostList({ posts, userId, onRefresh, onLike, onDelete }) {
  return (
    <section className="card">
      <div className="row">
        <h2>Posts</h2>
        <button onClick={onRefresh}>Refresh</button>
      </div>

      <div className="stack">
        {posts.length === 0 && <p className="muted">No posts yet.</p>}

        {posts.map((post) => {
          const isOwner = post.author?._id === userId;

          return (
            <article key={post._id} className="post">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>
              <p className="muted">
                {post.author?.email || "unknown"} • {post.likes?.length || 0} likes
              </p>
              <div className="row">
                <button onClick={() => onLike(post._id)}>Like</button>
                <button className="danger" disabled={!isOwner} onClick={() => onDelete(post._id)}>
                  {isOwner ? "Delete" : "Delete (owner only)"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
