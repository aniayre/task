import axios from "axios";

// Base URL of your backend API
const AUTH_BASE = "http://localhost:3001/api/auth";

/**
 * Register a new user
 * @param {Object} data - { name, email, password, role }
 * @returns {Object} { message, user, token }
 */
export const signup = async (data) => {
  const res = await axios.post(`${AUTH_BASE}/register`, data);
  return res.data;
};

/**
 * Login user
 * @param {Object} data - { email, password }
 * @returns {Object} { message, user, token }
 */
export const login = async (credentials) => {
  const res = await axios.post(`${AUTH_BASE}/login`, credentials);
  return res.data;
};

/**
 * Get current logged-in user
 * @param {string} token - JWT token
 * @returns {Object} { user }
 */
export const getMe = async (token) => {
  const res = await axios.get(`${AUTH_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
