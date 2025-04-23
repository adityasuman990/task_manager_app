import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Initialize user from token
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      const decoded = jwt_decode(token);
      setUser(decoded);
    }
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      throw err.response?.data?.message || 'Login failed';
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      throw err.response?.data?.message || 'Registration failed';
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
