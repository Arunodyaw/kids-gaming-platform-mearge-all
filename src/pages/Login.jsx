import React, { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap"; // Added Alert
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Hook for redirecting

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login triggered for:", username);
    setError(""); // Clear previous errors
    // JWT Backend logic will go here!
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to home page (or game page) on success
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("authChange")); // Tell the Navbar to update!
        navigate("/"); 
      } else {
        // Show the error message from the backend (e.g., "Invalid Password")
        setError(data.message);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <Card className="shadow-lg p-4 rounded-4" style={{ width: "100%", maxWidth: "400px", border: "none" }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: "#440455", fontWeight: "bold" }}>Welcome Back! 🎮</h2>
          {/* NEW: Error Alert Box */}
          {error && <Alert variant="danger" className="text-center py-2">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="p-2"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="p-2"
              />
            </Form.Group>

            <Button variant="warning" type="submit" className="w-100 fw-bold fs-5 rounded-pill mb-3">
              Login
            </Button>
          </Form>
          <div className="text-center mt-3">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" style={{ color: "#440455", fontWeight: "bold", textDecoration: "none" }}>Sign Up</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}