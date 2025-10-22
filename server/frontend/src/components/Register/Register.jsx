import React, { useState } from "react";
import userIcon from "../assets/person.png";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import closeIcon from "../assets/close.png";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goHome = () => {
    window.location.href = window.location.origin;
  };

  const register = async (e) => {
    e.preventDefault();

    if (
      !username.trim() ||
      !password.trim() ||
      !email.trim() ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      alert("All fields are required.");
      return;
    }

    const registerUrl = `${window.location.origin}/djangoapp/register`;
    setIsSubmitting(true);

    try {
      const res = await fetch(registerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, firstName, lastName, email }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "Authenticated") {
        sessionStorage.setItem("username", data.username);
        window.location.href = window.location.origin;
      } else if (data.error === "Already Registered") {
        alert("The user with the same username is already registered.");
        window.location.href = window.location.origin;
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong while registering. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="auth-container">
        <div className="header">
          <span className="text">SignUp</span>
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
        <form onSubmit={register}>
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
            <div>
              <img src={userIcon} className="img-icon" alt="First Name" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="input-field"
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <img src={userIcon} className="img-icon" alt="Last Name" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="input-field"
                onChange={(e) => setLastName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <img src={emailIcon} className="img-icon" alt="Email" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input-field"
                onChange={(e) => setEmail(e.target.value)}
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
              value={isSubmitting ? "Registering..." : "Register"}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
