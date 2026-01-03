import { useState } from "react";
import "./Login.css";
import {Link} from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /* Function to handle login */
  async function handleLogin(e) {

    e.preventDefault(); // stop browser from redirecting away from app
    setError("");

    // Send call to backend for login
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // do on success
    localStorage.setItem("token", data.token);
    localStorage.removeItem("guest");
    window.location.href = "/";
  }

  return (
    <div className="auth-wrapper">
      <section className="auth-hero">
        <h1 className="auth-title">BenchReport 🖥️</h1>
        <p className="auth-subtitle">Welcome back — Log in to continue</p>
      </section>

      <section className="auth-content">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Login</h2>

          {error && <div className="auth-error">{error}</div>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>

          <div className="auth-switch">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </div>

          <div className="auth-switch">
            Skip Login - <Link
              to="/"
              onClick={(e) => {
                e.preventDefault(); 
                localStorage.setItem("guest", "true");
                window.location.href = "/"; 
              }}
            >
              Continue As Guest
            </Link>

          </div>


        </form>
      </section>
    </div>
  );
}
