import React, { useState } from "react";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";
import "./Register.css";

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
      <div className="register_container">
        <div className="header">
          <span className="text">SignUp</span>
          <div>
            <a
              className="close_link"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                goHome();
              }}
            >
              <img className="close_icon" src={close_icon} alt="Close" />
            </a>
          </div>
          <hr />
        </div>
        <form onSubmit={register}>
          <div className="inputs">
            <div className="input">
              <img src={user_icon} className="img_icon" alt="Username" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input_field"
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <img src={user_icon} className="img_icon" alt="First Name" />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="input_field"
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <img src={user_icon} className="img_icon" alt="Last Name" />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="input_field"
                onChange={(e) => setLastName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <img src={email_icon} className="img_icon" alt="Email" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input_field"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="input">
              <img src={password_icon} className="img_icon" alt="Password" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="input_field"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="submit_panel">
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
