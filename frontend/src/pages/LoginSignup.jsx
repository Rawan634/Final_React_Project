import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Button, Form, Container, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../index.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");  // Only used in sign-up
  const navigate = useNavigate();  // Initialize useNavigate

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const data = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await axios.post(`http://localhost:5000${endpoint}`, data);

      // If login/signup is successful, store token and redirect to dashboard
      console.log(response.data);
      localStorage.setItem("token", response.data.token);  // Store token
      navigate("/dashboard");  // Redirect to the dashboard

    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="auth-card shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Label><FaUser className="me-2" />Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label><FaEnvelope className="me-2" />Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label><FaLock className="me-2" />Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="d-grid mb-3">
              <Button variant="primary" size="lg" type="submit">
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </div>
          </Form>
          <div className="text-center">
            <Button variant="link" className="switch-link" onClick={toggleForm}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginSignup;
