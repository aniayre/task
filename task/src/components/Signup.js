import React, { useState } from "react";
import { Form, Button, Card, Container, Alert } from "react-bootstrap";
import { signup } from "../services/auth"; // ✅ API call
import { useNavigate, Link } from "react-router-dom"; // ✅ navigation

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role || "user",
      });

      localStorage.setItem("token", res.token);

      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500); // ✅ redirect to login page
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
    >
      <Card
        className="shadow-lg p-4 w-100"
        style={{
          maxWidth: "420px",
          borderRadius: "15px",
          backgroundColor: "#ffffff",
        }}
      >
        <h3 className="text-center mb-4 text-success fw-bold">Create Account</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="role">
            <Form.Label>Role (optional)</Form.Label>
            <Form.Control
              type="text"
              name="role"
              placeholder="e.g., admin, user"
              value={formData.role}
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="w-100 fw-semibold"
            style={{ letterSpacing: "0.5px" }}
          >
            Sign Up
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <Link to="/login" className="text-success fw-semibold">
              Login here
            </Link>
          </small>
        </div>
      </Card>
    </Container>
  );
};

export default Signup;
