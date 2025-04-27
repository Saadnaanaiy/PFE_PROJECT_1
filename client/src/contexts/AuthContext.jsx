import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      if (token) {
        try {
          // Set the authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Fetch user data
          const response = await axios.get('http://localhost:8000/api/user');
          setUser(response.data);
        } catch (err) {
          console.error('Authentication check failed:', err);
          // Clear invalid tokens
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      // Store token in localStorage or sessionStorage based on "remember me"
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', response.data.access_token);
      storage.setItem('token_type', response.data.token_type);

      // Set authorization header for future requests
      axios.defaults.headers.common[
        'Authorization'
      ] = `${response.data.token_type} ${response.data.access_token}`;

      // Fetch user data
      const userResponse = await axios.get('http://localhost:8000/api/user');
      setUser(userResponse.data);

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/register',
        userData,
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear tokens and user data regardless of API response
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Add role checking functions
  const isAdmin = () => {
    return user?.role === 'administrateur';
  };

  const isInstructor = () => {
    return user?.role === 'instructeur';
  };

  const isStudent = () => {
    // Assuming 'etudiant' or default if role is not admin/instructor
    return user?.role === 'etudiant' || (!isAdmin() && !isInstructor());
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isInstructor,
    isStudent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
