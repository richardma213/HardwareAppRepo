import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* Function Page for User Signup / Auth */
export default function Signup() {

  // define signup change states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Function to handle signup
  const handleSignup = async (e) => {

    e.preventDefault(); // stop browser from redirecting away from app
    setError("");
    setLoading(true);


    try {
      // Try sending the api call to backend
      const res = await fetch("http://localhost:2000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      // Retrieve data from backend
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      // Success -> redirect to login
      navigate("/login");
    } catch (err) {
      setError("Network error. Please try again."); // catch error

    } finally {
      setLoading(false);

    }
  };

  return (
    <div className="auth-wrapper">

      <section className="auth-hero">
        <h1 className="auth-title">BenchReport 🖥️</h1>
        <p className="auth-subtitle">Create your account to get started</p>
      </section>

      <section className="auth-content">
        <form className="auth-card" onSubmit={handleSignup}>
          <h2>Create Account</h2>

          {error && <div className="auth-error">{error}</div>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <div className="auth-switch">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </form>
      </section>

    </div>

  );
}
