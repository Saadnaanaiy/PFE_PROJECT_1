import axios from 'axios';

const BASE_URL = '/api/categories';

/**
 * Get all categories
 * @returns {Promise<Array>} Categories
 */
export const getCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    console.error('Unexpected categories response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Get a specific category by ID
 * @param {number|string} categoryId - The ID of the category
 * @returns {Promise<Object>} Category details
 */
export const getCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${categoryId}`);
    
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    }
    
    throw new Error('Category not found');
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    throw error;
  }
};
