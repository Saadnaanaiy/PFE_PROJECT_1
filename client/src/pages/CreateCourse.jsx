import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiImage, FiDollarSign, FiClock, FiBookOpen, FiUpload } from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import axios from 'axios';
import CategoryManagement from './CategoryManagement';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    niveau: 'Débutant',
    dureeMinutes: '',
    categorie_id: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFormData({ ...formData, categorie_id: categoryId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categorie_id) {
      setError('Please select or create a category first');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create FormData object for file upload
      const courseFormData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          courseFormData.append(key, formData[key]);
        }
      }
      
      await axios.post('/api/instructor/courses', courseFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Redirect to courses list
      navigate('/instructor/courses');
      
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.response?.data?.message || 'Failed to create course');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 relative">
      {/* Decorative background elements */}
      <div
        className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0"
        style={{
          backgroundImage: `url(${moroccanPattern})`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          opacity: 0.05,
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>

      <div className="container-custom relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button 
            onClick={() => navigate('/instructor/courses')} 
            className="flex items-center text-primary hover:text-primary-dark mb-4"
          >
            <FiArrowLeft className="mr-2" /> Back to Courses
          </button>
          <h1 className="heading-lg mb-4">Create New Course</h1>
          <p className="text-neutral-600 max-w-2xl">
            Fill in the details below to create your new course. Start by selecting or creating a category, then add your course information.
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-card p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">1. Choose Category</h2>
          
          {/* Category Management Component */}
          <CategoryManagement onCategoryAdded={handleCategorySelect} />
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h2 className="text-xl font-semibold mb-6">2. Course Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-full">
              <label htmlFor="titre" className="block text-sm font-medium text-neutral-700 mb-1">
                Course Title*
              </label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter an engaging title for your course"
                required
              />
            </div>
            
            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                Course Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe what students will learn in your course"
                rows="5"
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="prix" className="block text-sm font-medium text-neutral-700 mb-1">
                <div className="flex items-center gap-1">
                  <FiDollarSign className="text-neutral-500" />
                  Price*
                </div>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="prix"
                name="prix"
                value={formData.prix}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. 49.99"
                required
              />
            </div>
            
            <div>
              <label htmlFor="dureeMinutes" className="block text-sm font-medium text-neutral-700 mb-1">
                <div className="flex items-center gap-1">
                  <FiClock className="text-neutral-500" />
                  Duration (minutes)*
                </div>
              </label>
              <input
                type="number"
                min="0"
                id="dureeMinutes"
                name="dureeMinutes"
                value={formData.dureeMinutes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g. 120"
                required
              />
            </div>
            
            <div>
              <label htmlFor="niveau" className="block text-sm font-medium text-neutral-700 mb-1">
                <div className="flex items-center gap-1">
                  <FiBookOpen className="text-neutral-500" />
                  Difficulty Level*
                </div>
              </label>
              <select
                id="niveau"
                name="niveau"
                value={formData.niveau}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="Débutant">Beginner</option>
                <option value="Intermédiaire">Intermediate</option>
                <option value="Avancé">Advanced</option>
              </select>
            </div>
            
            <div className="col-span-full">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                <div className="flex items-center gap-1">
                  <FiImage className="text-neutral-500" />
                  Course Image
                </div>
              </label>
              
              <div className="mt-1 flex items-center">
                {imagePreview ? (
                  <div className="relative group">
                    <img 
                      src={imagePreview} 
                      alt="Course preview" 
                      className="w-40 h-40 object-cover rounded-lg border border-neutral-300"
                    />
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
                      onClick={() => document.getElementById('image').click()}
                    >
                      <span className="text-white text-sm">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => document.getElementById('image').click()}
                    className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary cursor-pointer bg-neutral-50"
                  >
                    <FiUpload className="text-3xl text-neutral-400 mb-2" />
                    <span className="text-sm text-neutral-500">Upload Image</span>
                  </div>
                )}
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Recommended: 1280x720px (16:9 ratio), JPEG or PNG
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/instructor/courses')}
              className="btn-secondary px-6 py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                'Create Course'
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateCourse;