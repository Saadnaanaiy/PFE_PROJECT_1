import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure axios defaults globally
const configureAxiosDefaults = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartUpdateFlag, setCartUpdateFlag] = useState(0);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Get token from storage
        const token =
          localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Set up axios with token
        configureAxiosDefaults(token);

        // Fetch user data
        const response = await axios.get('http://localhost:8000/api/user');

        if (response.data) {
          setUser(response.data);
        } else {
          throw new Error('No user data returned');
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Clear invalid tokens
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        configureAxiosDefaults(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Notify components that cart has been updated
  const cartUpdated = () => {
    setCartUpdateFlag((prev) => prev + 1);
  };

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
      configureAxiosDefaults(`${response.data.access_token}`);

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
      configureAxiosDefaults(null);
      setUser(null);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Role checking functions
  const isAdmin = () => {
    return user?.role === 'administrateur'; // Keep the French version for consistency
  };

  const isInstructor = () => {
    return user?.role === 'instructeur';
  };

  const isStudent = () => {
    // Assuming 'etudiant' or default if role is not admin/instructor
    return (
      user?.role === 'etudiant' || (!isAdmin() && !isInstructor() && !!user)
    );
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
    cartUpdated,
    cartUpdateFlag,
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
