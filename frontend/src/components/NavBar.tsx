import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="nav">
      <Link to="/posts" className="brand">NodeBlog</Link>
      <nav>
        <Link to="/posts">Posts</Link>
        {isAuthenticated && <Link to="/posts/new">Create post</Link>}
        {!isAuthenticated && <Link to="/login">Login</Link>}
        {!isAuthenticated && <Link to="/signup">Sign up</Link>}
        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
