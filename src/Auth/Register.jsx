import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Loader/Loading";

const Register = ({ onLoginClick }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // New loading state

  const navigateTo = useNavigate();

  const userRegex = /^[a-zA-Z0-9_]{3,15}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  // const handleRegister = () => {
  //   console.log("Registering...", { username, email, password });
  // };
  const handleRegister = async () => {
    // Reset errors
    setErrors({});
    setLoading(true);

    // Validate username
    if (!userRegex.test(username)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username:
          "Invalid username. It must be 3-15 characters and can only contain letters, numbers, and underscores.",
      }));
      setLoading(false);
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email address.",
      }));
      setLoading(false);
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password:
          "Invalid password. It must be 6-20 characters and include at least one digit, one lowercase letter, and one uppercase letter.",
      }));
      setLoading(false);
    }

    // Check if there are validation errors
    if (Object.keys(errors).length !== 0) {
      return;
    }
    try {
      // Make a POST request to your backend API
      const response = await fetch(
        "https://my-tasks-ie4s.onrender.com/user/register",
        {
          // const response = await fetch("https://localhost:3001/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        console.log("User registered successfully");
        // You may want to handle the successful registration, such as redirecting to the login page
        // or automatically logging in the user.

        // For example, redirect to the login page
        navigateTo("/");
      } else {
        // If the request was not successful, handle the error
        setErrors((prevErrors) => ({
          ...prevErrors,
          regError: "Email / Username is already in use",
        }));
        console.error("User registration failed");
        // You can also display an error message to the user
      }
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      {errors.regError && <p className="error-message">{errors.regError}</p>}

      <label className="form-label">
        Username:
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      {errors.username && <p className="error-message">{errors.username}</p>}
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
      {errors.email && <p className="error-message">{errors.email}</p>}
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
      {errors.password && <p className="error-message">{errors.password}</p>}

      <br />
      <button className="register-button" onClick={handleRegister}>
        {loading ? <LoadingSpinner /> : "Register"}
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
