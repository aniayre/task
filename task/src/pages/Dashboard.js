import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Navbar,
  Nav,
  Dropdown,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { getTasks, addTask, updateTask, deleteTask } from "../services/api";
import { getMe } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    age: "",
    phone: "",
    gender: "",
    email: "",
    role: "",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });

  // ✅ Toast helper
  const showToast = (message, variant = "info") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ show: false, message: "", variant: "" }), 2500);
  };

  // ✅ Fetch table data (memoized to avoid dependency issues)
  const fetchRecords = useCallback(async () => {
    try {
      const data = await getTasks();
      setRecords(data);
      setFilteredRecords(data);
    } catch (err) {
      console.error("Error fetching records:", err);
      showToast("Failed to fetch data", "danger");
    } finally {
      setLoading(false);
    }
  }, []); // no dependencies — stable function

  // ✅ Fetch user on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await getMe(token);
        setUser(res.user);
        await fetchRecords(); // ✅ after authentication
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate, fetchRecords]); // ✅ dependencies fixed

  // ✅ Search filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredRecords(
      records.filter(
        (r) =>
          r.name.toLowerCase().includes(value) ||
          r.email.toLowerCase().includes(value) ||
          r.phone.toLowerCase().includes(value)
      )
    );
  };

  // ✅ Open Add/Edit modal
  const handleShowModal = (record = null) => {
    setFormData(
      record || {
        id: null,
        name: "",
        age: "",
        phone: "",
        gender: "",
        email: "",
        role: "",
      }
    );
    setShowModal(true);
  };

  // ✅ Save record
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateTask(formData.id, formData);
        showToast("Record updated successfully!", "success");
      } else {
        await addTask(formData);
        showToast("Record added successfully!", "success");
      }
      setShowModal(false);
      fetchRecords();
    } catch (err) {
      console.error("Error saving record:", err);
      showToast("Error saving record", "danger");
    }
  };

  // ✅ Delete record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteTask(id);
        showToast("Record deleted successfully!", "warning");
        fetchRecords();
      } catch (err) {
        console.error("Error deleting record:", err);
        showToast("Error deleting record", "danger");
      }
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* ✅ Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm">
        <Navbar.Brand>Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav" className="justify-content-end">
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" className="d-flex align-items-center">
                <FaUserCircle size={22} className="me-2" />
                {user ? user.name : "Loading..."}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {user && (
                  <>
                    <Dropdown.Header>
                      <strong>{user.name}</strong>
                      <div className="text-muted small">{user.email}</div>
                      <div className="text-muted small">Role: {user.role}</div>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                  </>
                )}
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* ✅ Main Content */}
      <Container fluid className="mt-4">
        <Row className="mb-3 justify-content-between">
          <Col xs={12} md={8} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={handleSearch}
            />
          </Col>
          <Col xs={12} md="auto" className="text-end">
            <Button onClick={() => handleShowModal()}>+ Add New</Button>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <tr key={record.id}>
                    <td>{index + 1}</td>
                    <td>{record.name}</td>
                    <td>{record.age}</td>
                    <td>{record.phone}</td>
                    <td>{record.gender}</td>
                    <td>{record.email}</td>
                    <td>{record.role}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleShowModal(record)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>

      {/* ✅ Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Edit Record" : "Add Record"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ✅ Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ show: false })}
          show={toast.show}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default DashboardPage;
