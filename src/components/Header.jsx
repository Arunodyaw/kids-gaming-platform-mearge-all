import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import '../index.css'; 
// import 'bootstrap/dist/css/bootstrap.min.css';


export default function Header() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // 1. Helper function to read the token
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // JWTs have 3 parts separated by dots. The middle part has the data!
        // 'atob' decodes it from base64 so we can read the username.
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.username);
      } catch (e) {
        console.error("Invalid token format");
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  };

  // 2. Run this when the Navbar loads, and listen for our custom signal
  useEffect(() => {
    checkAuth(); // Check immediately on load
    window.addEventListener("authChange", checkAuth); // Listen for logins/logouts
    
    // Cleanup listener when component unmounts
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  // 3. The Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Throw away the VIP wristband
    window.dispatchEvent(new Event("authChange")); // Signal the Navbar to update
    navigate("/login"); // Redirect to the login page
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="font-fredoka text-warning-dark">
          FunZone Arcade
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="fw-bold">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="fw-bold me-3">About Us</Nav.Link>
            <Nav.Link as={Link} to="/nogo-game" className="fw-bold fs-5">
                          🚦 NO GO Game
                        </Nav.Link>
                        <Nav.Link as={Link} to="/about" className="fw-bold fs-5">
                          ℹ️ About Us
                        </Nav.Link>
                        
            {/* 4. CONDITIONAL RENDERING: Show different buttons based on auth state */}
            {username ? (
              <>
                <span className="fw-bold text-success me-3">🎮 Hi, {username}!</span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout} className="fw-bold rounded-pill px-3">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" size="sm" className="fw-bold rounded-pill px-3 me-2">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="warning" size="sm" className="fw-bold rounded-pill px-3">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}