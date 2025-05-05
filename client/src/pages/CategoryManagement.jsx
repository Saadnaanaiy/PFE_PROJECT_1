import { useState, useEffect, useRef } from 'react';
import {
  FiPlus,
  FiCheck,
  FiX,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiImage,
} from 'react-icons/fi';
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
  const [showEditForm, setShowEditForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    nom: '',
    description: '',
    image: null,
  });
  const [editCategory, setEditCategory] = useState({
    id: null,
    nom: '',
    description: '',
    image: null,
    currentImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

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
      console.log('categories: ', response.data.categories);

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

      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('nom', newCategory.nom);
      formData.append('description', newCategory.description || '');

      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }

      const response = await axios.post(
        '/api/instructor/categories',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // Add new category to state
      const createdCategory = response.data.categorie;
      setCategories([...categories, createdCategory]);

      // Select the newly created category
      setSelectedCategory(createdCategory.id);
      if (onCategoryAdded) onCategoryAdded(createdCategory.id);

      // Reset form
      setNewCategory({ nom: '', description: '', image: null });
      setImagePreview(null);
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

  const handleCategoryUpdate = async (e) => {
    e.preventDefault();

    if (!editCategory.nom.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);

      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('nom', editCategory.nom);
      formData.append('description', editCategory.description || '');

      if (editCategory.image) {
        formData.append('image', editCategory.image);
      }

      // For PUT requests with FormData, may need to use the _method parameter
      formData.append('_method', 'PUT');

      const response = await axios.post(
        `/api/instructor/categories/${editCategory.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // Update category in state
      const updatedCategory = response.data.categorie;
      setCategories(
        categories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat,
        ),
      );

      // Reset form
      setEditCategory({
        id: null,
        nom: '',
        description: '',
        image: null,
        currentImage: null,
      });
      setEditImagePreview(null);
      setShowEditForm(false);
      setSuccess('Category updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

      setError(null);
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.response?.data?.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryDelete = async (categoryId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/instructor/categories/${categoryId}`);

      // Remove category from state
      const updatedCategories = categories.filter(
        (cat) => cat.id !== categoryId,
      );
      setCategories(updatedCategories);

      // If the deleted category was selected, select another one
      if (selectedCategory === categoryId) {
        const newSelectedId =
          updatedCategories.length > 0 ? updatedCategories[0].id : null;
        setSelectedCategory(newSelectedId);
        if (onCategoryAdded) onCategoryAdded(newSelectedId);
      }

      setConfirmDelete(null);
      setSuccess('Category deleted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

      setError(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.message || 'Failed to delete category');
      setConfirmDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategoryAdded) onCategoryAdded(categoryId);
  };

  const handleEditClick = (category) => {
    // Reset any forms and errors
    setShowAddForm(false);
    setError(null);

    // Set the edit form with category data
    setEditCategory({
      id: category.id,
      nom: category.nom,
      description: category.description || '',
      image: null,
      currentImage: category.image || null,
    });

    // Set image preview if category has an image
    if (category.image) {
      setEditImagePreview(category.image);
    } else {
      setEditImagePreview(null);
    }

    setShowEditForm(true);
  };

  const handleDeleteClick = (categoryId) => {
    setConfirmDelete(categoryId);
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'add') {
      setNewCategory({ ...newCategory, [name]: value });
    } else if (formType === 'edit') {
      setEditCategory({ ...editCategory, [name]: value });
    }
  };

  const handleImageChange = (e, formType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (formType === 'add') {
        setImagePreview(reader.result);
        setNewCategory({ ...newCategory, image: file });
      } else {
        setEditImagePreview(reader.result);
        setEditCategory({ ...editCategory, image: file });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (formType) => {
    if (formType === 'add') {
      fileInputRef.current.click();
    } else {
      editFileInputRef.current.click();
    }
  };

  const resetForms = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setNewCategory({ nom: '', description: '', image: null });
    setEditCategory({
      id: null,
      nom: '',
      description: '',
      image: null,
      currentImage: null,
    });
    setImagePreview(null);
    setEditImagePreview(null);
    setError(null);
  };

  const removeImage = (formType) => {
    if (formType === 'add') {
      setImagePreview(null);
      setNewCategory({ ...newCategory, image: null });
    } else {
      setEditImagePreview(null);
      setEditCategory({ ...editCategory, image: null, currentImage: null });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Select Category</h3>
        <button
          type="button"
          onClick={() => {
            resetForms();
            setShowAddForm(!showAddForm);
          }}
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

      {showAddForm && (
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
              onChange={(e) => handleInputChange(e, 'add')}
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
              onChange={(e) => handleInputChange(e, 'add')}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter category description"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Category Image (Optional)
            </label>

            <input
              type="file"
              id="image"
              name="image"
              ref={fileInputRef}
              onChange={(e) => handleImageChange(e, 'add')}
              className="hidden"
              accept="image/*"
            />

            {imagePreview ? (
              <div className="relative w-full md:w-1/2 lg:w-1/3 border border-neutral-300 rounded-lg overflow-hidden mb-2">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="w-full h-auto object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage('add')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  title="Remove image"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => triggerFileInput('add')}
                className="w-full md:w-1/2 lg:w-1/3 border-2 border-dashed border-neutral-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary"
              >
                <FiImage size={32} className="text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-500 text-center">
                  Click to upload an image
                  <br />
                  <span className="text-xs">PNG, JPG, JPEG (max 2MB)</span>
                </p>
              </div>
            )}
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
      )}

      {showEditForm && (
        <form
          onSubmit={handleCategoryUpdate}
          className="bg-white p-4 rounded-xl shadow-card mb-4"
        >
          <div className="mb-4">
            <label
              htmlFor="edit-nom"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Category Name*
            </label>
            <input
              type="text"
              id="edit-nom"
              name="nom"
              value={editCategory.nom}
              onChange={(e) => handleInputChange(e, 'edit')}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={editCategory.description}
              onChange={(e) => handleInputChange(e, 'edit')}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter category description"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="edit-image"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Category Image (Optional)
            </label>

            <input
              type="file"
              id="edit-image"
              name="image"
              ref={editFileInputRef}
              onChange={(e) => handleImageChange(e, 'edit')}
              className="hidden"
              accept="image/*"
            />

            {editImagePreview ? (
              <div className="relative w-full md:w-1/2 lg:w-1/3 border border-neutral-300 rounded-lg overflow-hidden mb-2">
                <img
                  src={
                    editImagePreview.startsWith('data:')
                      ? editImagePreview
                      : `${editImagePreview}`
                  }
                  alt="Category preview"
                  className="w-full h-auto object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage('edit')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  title="Remove image"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => triggerFileInput('edit')}
                className="w-full md:w-1/2 lg:w-1/3 border-2 border-dashed border-neutral-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary"
              >
                <FiImage size={32} className="text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-500 text-center">
                  Click to upload an image
                  <br />
                  <span className="text-xs">PNG, JPG, JPEG (max 2MB)</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowEditForm(false);
                setEditCategory({
                  id: null,
                  nom: '',
                  description: '',
                  image: null,
                  currentImage: null,
                });
                setEditImagePreview(null);
              }}
              className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-4 py-2 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FiCheck /> Update Category
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {!showAddForm && !showEditForm && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {loading && categories.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-8">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className={`relative rounded-lg transition-all overflow-hidden ${
                  selectedCategory === category.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:bg-neutral-100 shadow-card'
                }`}
              >
                {/* Category Image */}
                {category.image && (
                  <div
                    className="h-24 bg-neutral-100 overflow-hidden cursor-pointer"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <img
                      src={`${category.image}`}
                      alt={category.nom}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Category Content */}
                <div
                  className={`px-4 py-3 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-neutral-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div
                      className="font-medium cursor-pointer flex-grow"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      {category.nom}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(category)}
                        className={`p-1 rounded-full ${
                          selectedCategory === category.id
                            ? 'text-white/80 hover:text-white hover:bg-white/10'
                            : 'text-neutral-500 hover:text-primary hover:bg-neutral-100'
                        }`}
                        title="Edit category"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category.id)}
                        className={`p-1 rounded-full ${
                          selectedCategory === category.id
                            ? 'text-white/80 hover:text-white hover:bg-white/10'
                            : 'text-neutral-500 hover:text-red-500 hover:bg-neutral-100'
                        }`}
                        title="Delete category"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {category.description && (
                    <div
                      className={`text-xs mt-1 line-clamp-2 ${
                        selectedCategory === category.id
                          ? 'text-white/80'
                          : 'text-neutral-500'
                      }`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      {category.description}
                    </div>
                  )}
                </div>
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

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-2">Delete Category</h4>
            <p className="text-neutral-600 mb-4">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleCategoryDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
