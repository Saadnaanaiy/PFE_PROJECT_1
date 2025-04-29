import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiTrash2,
  FiArrowLeft,
  FiImage,
  FiDollarSign,
  FiClock,
  FiTag,
  FiAlertCircle,
} from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import axios from 'axios';

const CourseShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewCourse = id === 'create';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

  const [course, setCourse] = useState({
    titre: '',
    description: '',
    prix: 0,
    niveau: 'Débutant',
    dureeMinutes: 0,
    categorie_id: '',
    progress: 0,
    image: null,
    imageFile: null, // For file upload
  });

  // Fetch course data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await axios.get(
          '/api/instructor/categories',
        );
        setCategories(categoriesResponse.data.categories);

        // If editing an existing course, fetch its data
        if (!isNewCourse) {
          const courseResponse = await axios.get(
            `/api/instructor/courses/${id}`,
          );
          const courseData = courseResponse.data.course;
          console.log(courseResponse.data.course);
          setCourse({
            ...courseData,
            prix: parseFloat(courseData.prix),
            dureeMinutes: parseInt(courseData.dureeMinutes),
            progress: parseInt(courseData.progress),
            imageFile: null,
          });

          if (courseData.image) {
            setImagePreview(courseData.image);
          }
        } else if (categoriesResponse.data.categories.length > 0) {
          // Set default category for new course
          setCourse((prev) => ({
            ...prev,
            categorie_id: categoriesResponse.data.categories[0].id,
          }));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNewCourse]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        setCourse((prev) => ({ ...prev, imageFile: file }));

        // Create URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === 'number') {
      setCourse((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setCourse((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const formData = new FormData();

      // Append all course data to FormData
      Object.keys(course).forEach((key) => {
        if (key !== 'imageFile' && key !== 'image' && course[key] !== null) {
          formData.append(key, course[key]);
        }
      });

      // Append image file if present
      if (course.imageFile) {
        formData.append('image', course.imageFile);
      }

      let response;

      if (isNewCourse) {
        response = await axios.post('/api/instructor/courses', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post(
          `/api/instructor/courses/${id}?_method=PUT`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }

      // Redirect to courses list with success message
      navigate('/instructor/dashboard', {
        state: {
          message: isNewCourse
            ? 'Course created successfully'
            : 'Course updated successfully',
          type: 'success',
        },
      });

      navigate('/instructor/courses', {
        state: {
          message: isNewCourse
            ? 'Course created successfully'
            : 'Course updated successfully',
          type: 'success',
        },
      });
    } catch (err) {
      console.error('Error saving course:', err);
      setError(
        err.response?.data?.message ||
          'An error occurred while saving the course.',
      );

      // Scroll to top to show error
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`/api/instructor/courses/${id}`);

      // Redirect to courses list with success message
      navigate('/instructor/dashboard', {
        state: {
          message: 'Course deleted successfully',
          type: 'success',
        },
      });

      // navigate('/instructor/courses', {
      //   state: {
      //     message: 'Course deleted successfully',
      //     type: 'success',
      //   },
      // });
    } catch (err) {
      console.error('Error deleting course:', err);
      setError(
        err.response?.data?.message ||
          'An error occurred while deleting the course.',
      );
      setDeleteConfirmModal(false);
    }
  };

  // Calculate progress based on filled fields
  const calculateProgress = () => {
    let filledFields = 0;
    let totalFields = 6; // Title, description, price, level, duration, category

    if (course.titre) filledFields++;
    if (course.description && course.description.length > 20) filledFields++;
    if (course.prix > 0) filledFields++;
    if (course.niveau) filledFields++;
    if (course.dureeMinutes > 0) filledFields++;
    if (course.categorie_id) filledFields++;

    // Image is optional but adds to progress
    if (imagePreview || course.imageFile) {
      filledFields++;
      totalFields++;
    }

    return Math.round((filledFields / totalFields) * 100);
  };

  // Calculate progress for display
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-neutral-50 pb-16 relative">
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
          className="py-8"
        >
          <Link
            to="/instructor/courses"
            className="inline-flex items-center text-neutral-600 hover:text-primary mb-6"
          >
            <FiArrowLeft className="mr-2" /> Back to Courses
          </Link>

          <h1 className="heading-lg mb-4">
            {isNewCourse ? 'Create New Course' : 'Edit Course'}
          </h1>
          <p className="text-neutral-600 max-w-2xl">
            {isNewCourse
              ? 'Fill in the details below to create your new course. All fields marked with * are required.'
              : 'Update your course information below. All changes will be saved automatically.'}
          </p>
        </motion.div>

        {/* Loading/Error States */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">Loading course data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-start">
            <FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-1 mr-3" />
            <div>
              <h3 className="font-medium">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-xl shadow-card mb-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Course Completion</h3>
                <span className="text-primary font-medium">
                  {course.progress}%
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                {progress < 100
                  ? 'Complete all required fields to publish your course.'
                  : 'Your course is ready to be published!'}
              </p>
            </div>

            {/* Course Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-2"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-white p-6 rounded-xl shadow-card">
                    <h2 className="text-xl font-heading font-semibold mb-6">
                      Basic Information
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="titre"
                          className="block text-neutral-700 font-medium mb-2"
                        >
                          Course Title *
                        </label>
                        <input
                          type="text"
                          id="titre"
                          name="titre"
                          value={course.titre}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter a descriptive title"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-neutral-700 font-medium mb-2"
                        >
                          Course Description *
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={course.description}
                          onChange={handleInputChange}
                          required
                          rows="6"
                          className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="What will students learn in this course?"
                        ></textarea>
                        <p className="text-sm text-neutral-500 mt-1">
                          Minimum 20 characters recommended for better
                          visibility.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="categorie_id"
                          className="block text-neutral-700 font-medium mb-2"
                        >
                          Category *
                        </label>
                        <div className="relative">
                          <select
                            id="categorie_id"
                            name="categorie_id"
                            value={course.categorie_id}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-4 pr-10 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.nom}
                              </option>
                            ))}
                          </select>
                          <FiTag className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-white p-6 rounded-xl shadow-card">
                    <h2 className="text-xl font-heading font-semibold mb-6">
                      Additional Details
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="niveau"
                          className="block text-neutral-700 font-medium mb-2"
                        >
                          Level *
                        </label>
                        <select
                          id="niveau"
                          name="niveau"
                          value={course.niveau}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="Débutant">Beginner</option>
                          <option value="Intermédiaire">Intermediate</option>
                          <option value="Avancé">Advanced</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="prix"
                            className="block text-neutral-700 font-medium mb-2"
                          >
                            Price ($) *
                          </label>
                          <div className="relative">
                            <input
                              id="prix"
                              name="prix"
                              value={course.prix}
                              onChange={handleInputChange}
                              min="0"
                              step="0.01"
                              required
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="0.00"
                            />
                            <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="dureeMinutes"
                            className="block text-neutral-700 font-medium mb-2"
                          >
                            Duration (minutes) *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              id="dureeMinutes"
                              name="dureeMinutes"
                              value={course.dureeMinutes}
                              onChange={handleInputChange}
                              min="0"
                              required
                              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="60"
                            />
                            <FiClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="progress"
                          className="block text-neutral-700 font-medium mb-2"
                        >
                          Course Progress
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            id="progress"
                            name="progress"
                            value={course.progress}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            step="5"
                            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer focus:outline-none"
                          />
                          <div className="flex justify-between text-xs text-neutral-500 mt-1">
                            <span>Draft (0%)</span>
                            <span>In Progress</span>
                            <span>Published (100%)</span>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-500 mt-2">
                          Current progress: {course.progress}% -{' '}
                          {course.progress < 100 ? 'Draft' : 'Published'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-4">
                    {!isNewCourse && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmModal(true)}
                        className="px-6 py-3 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                        disabled={saving}
                      >
                        <FiTrash2 className="inline-block mr-2" />
                        Delete Course
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center"
                      disabled={saving}
                    >
                      {saving ? (
                        <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                      ) : (
                        <FiSave className="inline-block mr-2" />
                      )}
                      {isNewCourse ? 'Create Course' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Sidebar - Image Upload & Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white p-6 rounded-xl shadow-card sticky top-24">
                  <h2 className="text-xl font-heading font-semibold mb-6">
                    Course Image
                  </h2>

                  <div
                    className={`border-2 border-dashed rounded-lg ${
                      imagePreview
                        ? 'border-neutral-200'
                        : 'border-neutral-300 hover:border-primary'
                    } transition-colors overflow-hidden relative h-56 flex items-center justify-center mb-4`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Course preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <FiImage className="mx-auto text-4xl text-neutral-400 mb-3" />
                        <p className="text-neutral-600">No image uploaded</p>
                        <p className="text-sm text-neutral-500">
                          Recommended size: 1280x720px
                        </p>
                      </div>
                    )}

                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleInputChange}
                      accept="image/jpeg,image/png,image/gif,image/jpg"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      aria-label="Upload course image"
                    />
                  </div>

                  <div className="flex justify-center">
                    <label
                      htmlFor="image"
                      className="inline-block px-5 py-2 border border-primary text-primary rounded-lg cursor-pointer hover:bg-primary/5 transition-colors text-center"
                    >
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                  </div>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setCourse((prev) => ({ ...prev, imageFile: null }));
                      }}
                      className="w-full text-center text-sm text-neutral-600 hover:text-red-600 mt-3"
                    >
                      Remove Image
                    </button>
                  )}

                  <div className="border-t border-neutral-200 mt-6 pt-6">
                    <h3 className="font-medium mb-3">Course Summary</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-neutral-500">Title:</span>
                        <span className="font-medium text-right">
                          {course.titre || 'Not set'}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-500">Category:</span>
                        <span className="font-medium text-right">
                          {categories.find(
                            (c) => c.id === parseInt(course.categorie_id),
                          )?.nom || 'Not set'}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-500">Level:</span>
                        <span className="font-medium">{course.niveau}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-500">Price:</span>
                        <span className="font-medium">
                          ${course.prix.toFixed(2)}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-500">Duration:</span>
                        <span className="font-medium">
                          {Math.floor(course.dureeMinutes / 60) > 0
                            ? `${Math.floor(course.dureeMinutes / 60)}h `
                            : ''}
                          {course.dureeMinutes % 60}m
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-neutral-500">Status:</span>
                        <span
                          className={`font-medium ${
                            course.progress === 100
                              ? 'text-green-600'
                              : 'text-orange-500'
                          }`}
                        >
                          {course.progress === 100 ? 'Published' : 'Draft'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="px-6 py-4 bg-red-50 border-b border-neutral-200">
                <h3 className="font-heading font-bold text-xl text-red-600">
                  Delete Course
                </h3>
              </div>
              <div className="p-6">
                <p className="text-neutral-700 mb-3">
                  Are you sure you want to delete this course? This action
                  cannot be undone.
                </p>
                <p className="text-neutral-600 mb-6 text-sm">
                  All course content, student enrollments, and associated data
                  will be permanently removed.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteConfirmModal(false)}
                    className="px-5 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseShow;
