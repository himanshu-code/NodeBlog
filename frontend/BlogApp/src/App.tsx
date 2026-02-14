import type { ReactNode } from "react";
import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Typography } from "@mui/material";
import { Navigate, Route, Routes, Link as RouterLink } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import CreatePostPage from "./pages/CreatePostPage";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import SignupPage from "./pages/SignupPage";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AuthOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/posts" replace />;
  }
  return children;
};

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", pb: 6 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NodeBlog Frontend
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
            <Button color="inherit" component={RouterLink} to="/posts">
              Posts
            </Button>
            <Button color="inherit" component={RouterLink} to="/create-post">
              Create
            </Button>
            {!isAuthenticated && (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/signup">
                  Signup
                </Button>
              </>
            )}
          </Stack>
          <Chip
            color={isAuthenticated ? "success" : "default"}
            label={isAuthenticated ? "Authenticated" : "Guest"}
            sx={{ mr: 2 }}
          />
          {isAuthenticated && (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthOnlyRoute>
                <LoginPage />
              </AuthOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthOnlyRoute>
                <SignupPage />
              </AuthOnlyRoute>
            }
          />
          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
