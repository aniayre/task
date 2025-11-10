import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import { login } from "../services/auth"; 

const Login = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.token); 
      localStorage.setItem("user", JSON.stringify(res.user));

      
      if (rememberMe) {
        localStorage.setItem("rememberMe", email);
      } else {
        localStorage.removeItem("rememberMe");
      }

      alert("Login successful!");
      navigate("/dashboard"); 
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Check
          type="checkbox"
          label="Remember me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <Button variant="link" className="p-0 text-decoration-none">
          Forgot Password?
        </Button>
      </div>

      <Button variant="primary" type="submit" className="w-100">
        Login
      </Button>
    </Form>
  );
};

export default Login;
