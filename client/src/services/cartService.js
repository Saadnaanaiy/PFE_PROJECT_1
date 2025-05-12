import axios from 'axios';

const BASE_URL = '/api/cart';

/**
 * Get current user's cart items from the server
 * @returns {Promise<Array>} Cart items
 */
export const getCartItems = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return [];
    }

    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

/**
 * Add a course to the cart
 * @param {number|string} courseId - The ID of the course to add
 * @returns {Promise<Object>} Result object with success status
 */
export const addToCart = async (courseId) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(
      `${BASE_URL}/add`,
      {
        course_id: courseId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Remove a course from the cart
 * @param {number|string} courseId - The ID of the course to remove
 * @returns {Promise<Object>} Result object with success status
 */
export const removeFromCart = async (courseId) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.delete(`${BASE_URL}/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Clear the entire cart
 * @returns {Promise<Object>} Result object with success status
 */
export const clearCart = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.delete(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Check if a course is in the user's cart
 * @param {number|string} courseId - The ID of the course to check
 * @returns {Promise<boolean>} Whether the course is in the cart
 */
export const checkInCart = async (courseId) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const response = await axios.get(`${BASE_URL}/check/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.success && response.data.inCart;
  } catch (error) {
    console.error('Error checking cart status:', error);
    return false;
  }
};
