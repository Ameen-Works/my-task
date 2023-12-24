import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Loader/Loading";

const Login = ({ onLogin, onRegisterClick }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  const [error, setError] = useState(null); // State to manage error message
  const [loading, setLoading] = useState(false); // New loading state

  // const handleLogin = () => {
  //   // Assume successful login for simplicity
  //   const loggedInUser = { username: username /* other user details */ };
  //   onLogin(loggedInUser); // Invoke the callback function to update the user state
  //   navigateTo("/tasks");
  // };

  const handleLogin = async () => {
    setLoading(true);
    try {
      setError(null);
      // Make a POST request to your backend API
      const response = await fetch(
        "https://my-tasks-ie4s.onrender.com/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        // Parse the JSON response
        const data = await response.json();

        // Update the user state with the received data
        onLogin({
          userId: data.userId,
          username: data.username,
          token: data.token,
          expiresIn: data.expiresIn,
        });

        // You may want to handle the successful login, such as redirecting to the tasks page
        // or updating the UI based on the user login status.

        // For example, redirect to the tasks page
        navigateTo("/tasks");
      } else {
        const errorData = await response.json(); // Parse the error JSON
        setError(errorData.message);
        // If the request was not successful, handle the error
        console.error("Login failed");
        // You can also display an error message to the user
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An unexpected error occurred."); // Set a generic error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {loading && <LoadingSpinner />}
      <h2 className="login-title">Login</h2>

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
        Password:
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleLogin} className="login-button">
        Login
      </button>
      <br />
      <p>
        Don't have an account?{" "}
        <span
          className="register-link"
          onClick={() => {
            setError(null);
            navigateTo("/register");
          }}
          style={{ cursor: "pointer", color: "blue" }}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
