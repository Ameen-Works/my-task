import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = ({ onLoginClick }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  // const handleRegister = () => {
  //   console.log("Registering...", { username, email, password });
  // };
  const handleRegister = async () => {
    try {
      // Make a POST request to your backend API
      const response = await fetch("http://localhost:3001/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        console.log("User registered successfully");
        // You may want to handle the successful registration, such as redirecting to the login page
        // or automatically logging in the user.

        // For example, redirect to the login page
        navigateTo("/");
      } else {
        // If the request was not successful, handle the error
        console.error("User registration failed");
        // You can also display an error message to the user
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <label className="form-label">
        Username:
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label className="form-label">
        Email:
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label className="form-label">
        Password:
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button className="register-button" onClick={handleRegister}>
        Register
      </button>
      <br />
      <p>
        Already have an account?{" "}
        <span
          className="login-link"
          onClick={() => navigateTo("/")}
          style={{ cursor: "pointer", color: "blue" }}
        >
          Login here
        </span>
      </p>
    </div>
  );
};

export default Register;
