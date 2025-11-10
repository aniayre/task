import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTwitter, FaGlobe, FaEnvelope } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="d-flex flex-column justify-content-between align-items-center vh-100 text-center p-4">   
      <div>
        <img src="" alt="Logo" width="100" className="mb-3" />
        <h1>Welcome to My Web App</h1>
      </div>


      <div className="d-flex flex-column gap-3">
        <Button variant="primary" href="/login">
          Login
        </Button>
        <Button variant="outline-primary" href="/register">
          Register
        </Button>
      </div>

      <div className="text-center mb-3">
        <p className="mb-2 fw-semibold">Connect with us</p>
        <div className="d-flex justify-content-center gap-4">
          <a href="mailto:example@gmail.com" className="text-dark">
            <FaEnvelope size={24} />
          </a>
          <a href="https://www.google.com" className="text-dark">
            <FaGlobe size={24} />
          </a>
          <a href="https://twitter.com" className="text-dark">
            <FaTwitter size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
