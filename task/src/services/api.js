import axios from "axios";

const API_URL = "http://localhost:3001/api/tasks";

// Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all records
export const getTasks = async () => {
  const res = await axios.get(API_URL, getAuthHeaders());
  return res.data;
};

// Add new record
export const addTask = async (data) => {
  const res = await axios.post(API_URL, data, getAuthHeaders());
  return res.data;
};

// Update record
export const updateTask = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return res.data;
};

// Delete record
export const deleteTask = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

