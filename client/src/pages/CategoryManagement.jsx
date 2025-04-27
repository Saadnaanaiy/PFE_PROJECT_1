import { useState, useEffect } from 'react';
import { FiPlus, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';

const CategoryManagement = ({
  onCategoryAdded,
  preSelectedCategoryId = null,
}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    preSelectedCategoryId,
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ nom: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Set selected category from prop if available
  useEffect(() => {
    if (preSelectedCategoryId) {
      setSelectedCategory(preSelectedCategoryId);
    }
  }, [preSelectedCategoryId]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/instructor/categories');
      setCategories(response.data.categories);

      // If we have categories but no selection, select the first one
      if (response.data.categories.length > 0 && !selectedCategory) {
        setSelectedCategory(response.data.categories[0].id);
        if (onCategoryAdded) onCategoryAdded(response.data.categories[0].id);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryCreate = async (e) => {
    e.preventDefault();

    if (!newCategory.nom.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        '/api/instructor/categories',
        newCategory,
      );

      // Add new category to state
      const createdCategory = response.data.categorie;
      setCategories([...categories, createdCategory]);

      // Select the newly created category
      setSelectedCategory(createdCategory.id);
      if (onCategoryAdded) onCategoryAdded(createdCategory.id);

      // Reset form
      setNewCategory({ nom: '', description: '' });
      setShowAddForm(false);
      setSuccess('Category created successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

      setError(null);
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategoryAdded) onCategoryAdded(categoryId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Select Category</h3>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-primary hover:text-primary-dark text-sm flex items-center gap-1"
        >
          {showAddForm ? (
            <>
              <FiX /> Cancel
            </>
          ) : (
            <>
              <FiPlus /> Add New Category
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {showAddForm ? (
        <form
          onSubmit={handleCategoryCreate}
          className="bg-white p-4 rounded-xl shadow-card mb-4"
        >
          <div className="mb-4">
            <label
              htmlFor="nom"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Category Name*
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={newCategory.nom}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter category description"
              rows="3"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-4 py-2 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiCheck /> Create Category
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {loading && categories.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-8">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-4 py-3 rounded-lg cursor-pointer transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 shadow-card'
                }`}
              >
                <div className="font-medium">{category.nom}</div>
                {category.description && (
                  <div
                    className={`text-xs mt-1 line-clamp-2 ${
                      selectedCategory === category.id
                        ? 'text-white/80'
                        : 'text-neutral-500'
                    }`}
                  >
                    {category.description}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-white rounded-lg shadow-card">
              <p className="text-neutral-600">
                No categories found. Create one to get started.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
