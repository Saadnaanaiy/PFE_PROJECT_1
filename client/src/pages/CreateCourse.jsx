import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiImage,
  FiDollarSign,
  FiClock,
  FiBookOpen,
  FiUpload,
  FiLayout,
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import axios from 'axios';
import CategoryManagement from './CategoryManagement';
import SectionManager from '../components/SectionManager';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    niveau: 'Débutant',
    dureeMinutes: '',
    categorie_id: '',
    image: null,
  });
  const [sections, setSections] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

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

  // Modified to NOT auto-advance to next step
  const handleCategorySelect = (categoryId) => {
    setFormData({ ...formData, categorie_id: categoryId });
    // Removed auto-advancing to next step
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categorie_id) {
      setError('Please select or create a category first');
      setCurrentStep(1);
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

      // Add sections if any
      if (sections.length > 0) {
        // Create a proper array structure for Laravel to recognize
        sections.forEach((section, index) => {
          Object.keys(section).forEach((key) => {
            courseFormData.append(`sections[${index}][${key}]`, section[key]);
          });
        });
      }

      await axios.post('/api/instructor/courses', courseFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full font-medium transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-neutral-500 border-2 border-neutral-200'
                }`}
              >
                {currentStep > step ? (
                  <FiCheck className="text-lg" />
                ) : (
                  <span>{step}</span>
                )}
                <div className="absolute -bottom-6 whitespace-nowrap text-xs font-medium text-neutral-600">
                  {step === 1 && 'Category'}
                  {step === 2 && 'Details'}
                  {step === 3 && 'Structure'}
                </div>
              </div>
              {step < 3 && (
                <div
                  className={`h-1 w-16 md:w-24 transition-all duration-300 ${
                    currentStep > step ? 'bg-primary' : 'bg-neutral-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
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

      <div className="container mx-auto max-w-5xl px-4 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/instructor/courses')}
            className="flex items-center text-primary hover:text-primary-dark mb-4 font-medium transition-colors group"
          >
            <FiArrowLeft className="mr-2 group-hover:translate-x-[-3px] transition-transform" />{' '}
            Back to Courses
          </button>
          <h1 className="text-3xl font-bold mb-4 text-neutral-800">
            Create New Course
          </h1>
          <p className="text-neutral-600 max-w-2xl">
            Fill in the details below to create your new course. Follow the
            steps to set up your course structure.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 border border-red-200 shadow-sm flex items-start"
          >
            <FiX className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>{error}</div>
          </motion.div>
        )}

        {renderStepIndicator()}

        {/* Step 1: Category Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                1
              </span>
              Choose Category
            </h2>

            {/* Category Management Component */}
            <CategoryManagement onCategoryAdded={handleCategorySelect} />

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.categorie_id}
                className={`flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-medium shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[1px] ${
                  !formData.categorie_id
                    ? 'opacity-50 cursor-not-allowed bg-neutral-400'
                    : 'hover:bg-primary-dark'
                }`}
              >
                Next: Course Details
                <FiChevronRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Course Details */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                2
              </span>
              Course Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-full">
                <label
                  htmlFor="titre"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Course Title*
                </label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                  placeholder="Enter an engaging title for your course"
                  required
                />
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Course Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                  placeholder="Describe what students will learn in your course"
                  rows="5"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="prix"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <FiDollarSign className="text-primary" />
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
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                  placeholder="e.g. 49.99"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="dureeMinutes"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <FiClock className="text-primary" />
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
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                  placeholder="e.g. 120"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="niveau"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <FiBookOpen className="text-primary" />
                    Difficulty Level*
                  </div>
                </label>
                <select
                  id="niveau"
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
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
                    <FiImage className="text-primary" />
                    Course Image
                  </div>
                </label>

                <div className="mt-1 flex items-center">
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Course preview"
                        className="w-40 h-40 object-cover rounded-lg border border-neutral-300 shadow-sm"
                      />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-lg cursor-pointer"
                        onClick={() => document.getElementById('image').click()}
                      >
                        <span className="text-white text-sm font-medium">
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => document.getElementById('image').click()}
                      className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary cursor-pointer bg-neutral-50 transition-colors"
                    >
                      <FiUpload className="text-3xl text-neutral-400 mb-2" />
                      <span className="text-sm text-neutral-500 font-medium">
                        Upload Image
                      </span>
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

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center px-6 py-3 rounded-full border-2 border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 transition-all active:translate-y-[1px]"
              >
                <FiChevronLeft className="mr-2" />
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  !formData.titre ||
                  !formData.description ||
                  !formData.prix ||
                  !formData.dureeMinutes
                }
                className={`flex items-center justify-center px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[1px] ${
                  !formData.titre ||
                  !formData.description ||
                  !formData.prix ||
                  !formData.dureeMinutes
                    ? 'bg-neutral-400 text-white opacity-50 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                Next: Course Structure
                <FiChevronRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Course Structure (Sections) */}
        {currentStep === 3 && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                3
              </span>
              Course Structure
            </h2>

            <div className="border-b border-neutral-200 pb-6 mb-6">
              <SectionManager sections={sections} setSections={setSections} />
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center px-6 py-3 rounded-full border-2 border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 transition-all active:translate-y-[1px]"
              >
                <FiChevronLeft className="mr-2" />
                Back
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/instructor/courses')}
                  className="flex items-center justify-center px-6 py-3 rounded-full border-2 border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-100 transition-all active:translate-y-[1px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-medium shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[1px] disabled:bg-primary/70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can add content to your sections
                after creating the course.
                {sections.length === 0 &&
                  " You haven't added any sections yet, but you can still create your course and add sections later."}
              </p>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
