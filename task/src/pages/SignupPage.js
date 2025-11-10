import { Navbar, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import SignupForm from "../components/Signup";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = (data) => {
    console.log("Signup data:", data);
    // Later: Call backend API here
  };

  return (
    <>
      <Navbar bg="light" className="shadow-sm">
        <Container className="d-flex justify-content-between align-items-center">
          <Button variant="link" onClick={() => navigate('/')} className="text-dark">
            <FaArrowLeft size={20} />
          </Button>
          <h5 className="m-0 text-center flex-grow-1">Register</h5>
          <div style={{ width: "24px" }} />
        </Container>
      </Navbar>

      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <SignupForm onSubmit={handleSignup} />
      </div>
    </>
  );
};

export default SignupPage;
