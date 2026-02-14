import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import type { Post } from "../types";

interface PostListProps {
  posts: Post[];
  userId: string;
  onRefresh: () => Promise<void>;
  onLike: (postId: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
}

export default function PostList({ posts, userId, onRefresh, onLike, onDelete }: PostListProps) {
  return (
    <Card>
      <CardHeader
        title="Posts"
        action={
          <Button onClick={onRefresh} variant="outlined" size="small">
            Refresh
          </Button>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          {posts.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No posts yet.
            </Typography>
          )}

          {posts.map((post) => {
            const isOwner = post.author?._id === userId;
            const likesCount = post.likes?.length || 0;

            return (
              <Box key={post._id}>
                <Stack spacing={1}>
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography variant="body1">{post.content}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                    <Chip
                      label={`${post.author?.email || "unknown"} • ${likesCount} likes`}
                      variant="outlined"
                    />
                    <Stack direction="row" spacing={0.5}>
                      <IconButton color="primary" onClick={() => onLike(post._id)}>
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        disabled={!isOwner}
                        onClick={() => onDelete(post._id)}
                        title={isOwner ? "Delete" : "Delete (owner only)"}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
                <Divider sx={{ mt: 2 }} />
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
