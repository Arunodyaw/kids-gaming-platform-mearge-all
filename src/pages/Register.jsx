import React, { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap"; // Added Alert
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

 const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, age: Number(age) }) // Ensure age is sent as a number
      });

      const data = await response.json();

      if (data.success) {
        // Send them to the login page so they can log in with their new account
        navigate("/login"); 
      } else {
        // Show backend error (e.g., "Username Already Exists")
        setError(data.message);
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <Card className="shadow-lg p-4 rounded-4" style={{ width: "100%", maxWidth: "400px", border: "none", backgroundColor: "#fdfbfd" }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: "#440455", fontWeight: "bold" }}>Join the Fun! 🚀</h2>
          {error && <Alert variant="danger" className="text-center py-2">{error}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Choose a Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="SuperKid99" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="p-2"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAge">
              <Form.Label>Age</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="How old are you?" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required 
                className="p-2"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Secret Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Shhh..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="p-2"
              />
            </Form.Group>

            <Button variant="warning" type="submit" className="w-100 fw-bold fs-5 rounded-pill mb-3">
              Create Account
            </Button>
          </Form>
          <div className="text-center mt-3">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" style={{ color: "#440455", fontWeight: "bold", textDecoration: "none" }}>Log In</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}