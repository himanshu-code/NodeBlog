import { useState } from "react";
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import type { PostPayload } from "../types";

interface PostComposerProps {
  onCreate: (payload: PostPayload) => Promise<void>;
  disabled: boolean;
}

const emptyPost: PostPayload = { title: "", content: "" };

export default function PostComposer({ onCreate, disabled }: PostComposerProps) {
  const [postForm, setPostForm] = useState<PostPayload>(emptyPost);

  const submitPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onCreate(postForm);
    setPostForm(emptyPost);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create Post
        </Typography>

        <Box component="form" onSubmit={submitPost}>
          <Stack spacing={1.5}>
            <TextField
              required
              label="Post title"
              value={postForm.title}
              onChange={(event) => setPostForm((current) => ({ ...current, title: event.target.value }))}
            />
            <TextField
              required
              multiline
              minRows={4}
              label="Post content"
              value={postForm.content}
              onChange={(event) => setPostForm((current) => ({ ...current, content: event.target.value }))}
            />
            <Button type="submit" variant="contained" disabled={disabled}>
              Create Post
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
