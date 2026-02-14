import { useState } from "react";

const initialRegister = { name: "", email: "", password: "" };
const initialLogin = { email: "", password: "" };

export default function AuthPanel({ onRegister, onLogin, authStatus }) {
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginForm, setLoginForm] = useState(initialLogin);

  const submitRegister = async (event) => {
    event.preventDefault();
    await onRegister(registerForm);
    setRegisterForm(initialRegister);
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    await onLogin(loginForm);
    setLoginForm(initialLogin);
  };

  return (
    <section className="card">
      <h2>Authentication</h2>
      <div className="grid two-col">
        <form className="stack" onSubmit={submitRegister}>
          <h3>Register</h3>
          <input
            required
            placeholder="Name"
            value={registerForm.name}
            onChange={(event) =>
              setRegisterForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={(event) =>
              setRegisterForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(event) =>
              setRegisterForm((current) => ({ ...current, password: event.target.value }))
            }
          />
          <button type="submit">Register</button>
        </form>

        <form className="stack" onSubmit={submitLogin}>
          <h3>Login</h3>
          <input
            required
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(event) =>
              setLoginForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm((current) => ({ ...current, password: event.target.value }))
            }
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <p className="muted">{authStatus}</p>
    </section>
  );
}
