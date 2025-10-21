import React, { useState } from "react";
import "./Login.css";

const Login = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(true);

  const loginUrl = `${window.location.origin}/djangoapp/login`;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "Authenticated") {
        sessionStorage.setItem("username", data.username);
        setOpen(false);
      } else {
        alert("The user could not be authenticated.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    window.location.href = "/";
    return null;
  }

  return (
    <div>
      <div onClick={onClose}>
        <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
          <form className="login_panel" onSubmit={handleLogin}>
            <div>
              <span className="input-field">Username </span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <span className="input-field">Password </span>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <input
                className="action_button"
                type="submit"
                value={isSubmitting ? "Logging in..." : "Login"}
                disabled={isSubmitting}
              />
              <input
                className="action_button"
                type="button"
                value="Cancel"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              />
            </div>
            <a className="loginlink" href="/register">
              Register Now
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
