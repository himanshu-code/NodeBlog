import { useState } from "react";
import { Box, Button, Card, CardContent, Grid2, Stack, TextField, Typography } from "@mui/material";
import type { AuthFormPayload } from "../types";

interface AuthPanelProps {
  onRegister: (payload: Required<AuthFormPayload>) => Promise<void>;
  onLogin: (payload: Pick<AuthFormPayload, "email" | "password">) => Promise<void>;
  authStatus: string;
}

const initialRegister = { name: "", email: "", password: "" };
const initialLogin = { email: "", password: "" };

export default function AuthPanel({ onRegister, onLogin, authStatus }: AuthPanelProps) {
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginForm, setLoginForm] = useState(initialLogin);

  const submitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onRegister(registerForm);
    setRegisterForm(initialRegister);
  };

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onLogin(loginForm);
    setLoginForm(initialLogin);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Authentication
        </Typography>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box component="form" onSubmit={submitRegister}>
              <Stack spacing={1.5}>
                <Typography variant="h6">Register</Typography>
                <TextField
                  required
                  label="Name"
                  value={registerForm.name}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))}
                />
                <TextField
                  required
                  type="email"
                  label="Email"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                />
                <TextField
                  required
                  type="password"
                  label="Password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, password: event.target.value }))
                  }
                />
                <Button type="submit" variant="contained">
                  Register
                </Button>
              </Stack>
            </Box>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box component="form" onSubmit={submitLogin}>
              <Stack spacing={1.5}>
                <Typography variant="h6">Login</Typography>
                <TextField
                  required
                  type="email"
                  label="Email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                />
                <TextField
                  required
                  type="password"
                  label="Password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                />
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Stack>
            </Box>
          </Grid2>
        </Grid2>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {authStatus}
        </Typography>
      </CardContent>
    </Card>
  );
}
