import api from './api';

const authService = {
  // User login
  login: async (email, password) => {
    // Get CSRF cookie first (required for Laravel Sanctum)
    await api.get('/sanctum/csrf-cookie');

    // Send login request
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  // User registration
  register: async (userData) => {
    // Get CSRF cookie first
    await api.get('/sanctum/csrf-cookie');

    // Send registration request
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Get authenticated user
  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      await authService.getUser();
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
