import React from "react";
import { Navbar, Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import LoginForm from "../components/Login";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (data) => {
    console.log("Login data:", data);
    // later you’ll call backend API here
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar bg="light" className="shadow-sm">
        <Container className="d-flex justify-content-between align-items-center">
          <Button variant="link" onClick={() => navigate('/')} className="text-dark">
            <FaArrowLeft size={20} />
        </Button>
          <h5 className="m-0 text-center flex-grow-1">Login</h5>
          <div style={{ width: "24px" }} />
        </Container>
      </Navbar>

      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Card style={{ width: "100%", maxWidth: "380px" }} className="p-4 shadow-sm">
          <h4 className="text-center mb-4">Login form</h4>
          <LoginForm onSubmit={handleLogin} />
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
