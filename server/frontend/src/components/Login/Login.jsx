import React, { useState } from "react";
import userIcon from "../assets/person.png";
import passwordIcon from "../assets/password.png";
import closeIcon from "../assets/close.png";

const Login = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(true);

  const loginUrl = `${window.location.origin}/djangoapp/login`;

  const goHome = () => {
    window.location.href = window.location.origin;
  };

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
      <div className="auth-container">
        <div className="header">
          <span className="text">LogIn</span>
          <div>
            <a
              className="close-link"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                goHome();
              }}
            >
              <img className="close-icon" src={closeIcon} alt="Close" />
            </a>
          </div>
          <hr />
        </div>
        <form onSubmit={handleLogin}>
          <div className="inputs">
            <div className="input">
              <img src={userIcon} className="img-icon" alt="Username" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input-field"
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="input">
              <img src={passwordIcon} className="img-icon" alt="Password" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="input-field"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="submit-panel">
            <input
              className="submit"
              type="submit"
              value={isSubmitting ? "Login in..." : "Login"}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
