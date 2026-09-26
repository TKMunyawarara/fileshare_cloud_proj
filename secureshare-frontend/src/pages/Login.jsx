import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        res = await register(fullName, email, password);
      } else {
        res = await login(email, password);
      }

      // Save credentials to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#ffffff",
          padding: "2.5rem",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>☁️</div>
          <h1
            style={{
              color: "#0f172a",
              fontSize: "1.75rem",
              fontWeight: "700",
              margin: 0,
            }}
          >
            SecureShare
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.95rem",
              marginTop: "0.35rem",
              marginBottom: 0,
            }}
          >
            {isRegister ? "Create a new account" : "Welcome back! Please login."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "0.75rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Full Name field (Register only) */}
        {isRegister && (
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                color: "#334155",
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.375rem",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Suguna"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.625rem 0.875rem",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            style={{
              display: "block",
              color: "#334155",
              fontSize: "0.875rem",
              fontWeight: "600",
              marginBottom: "0.375rem",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.625rem 0.875rem",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "0.95rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              color: "#334155",
              fontSize: "0.875rem",
              fontWeight: "600",
              marginBottom: "0.375rem",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.625rem 0.875rem",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "0.95rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            fontWeight: "600",
            fontSize: "1rem",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "background-color 0.2s",
          }}
        >
          {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
        </button>

        {/* Toggle Login/Register */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            marginBottom: 0,
            fontSize: "0.875rem",
            color: "#64748b",
          }}
        >
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            style={{
              color: "#4f46e5",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;