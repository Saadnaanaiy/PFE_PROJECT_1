import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiInfo, FiBook, FiImage } from 'react-icons/fi';
import morocademyIcon from '../assets/morocademy.ico';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'etudiant',  // Changed back to 'student'
    bio: '',
    specialite: '',
    image: null,
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Check password match whenever either password field changes
    if (formData.password || formData.password_confirmation) {
      setPasswordMatch(formData.password === formData.password_confirmation);
    }
  }, [formData.password, formData.password_confirmation]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (files && files[0]) {
        // Handle file input
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      // Handle other input types
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.nom || !formData.email || !formData.password || !formData.password_confirmation) {
      setError('All fields are required');
      return false;
    }
    
    if (!passwordMatch) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Instructor-specific validation
    if (formData.role === 'instructor' && (!formData.bio || !formData.specialite)) {
      setError('Bio and specialization are required for instructors');
      return false;
    }
    
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('password_confirmation', formData.password_confirmation);
      formDataToSend.append('role', formData.role);
      
      if (formData.role === 'instructeur') {
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('specialite', formData.specialite);
      }
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      const response = await axios.post('http://localhost:8000/api/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors from Laravel
        const firstError = Object.values(err.response.data.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <motion.div
            className="bg-white rounded-xl p-8 shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-24 h-24 relative">
                  <img
                    src={morocademyIcon}
                    alt="MarocAcademy"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute -inset-1 bg-primary/10 rounded-full -z-10 animate-pulse"></div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary/20 w-16 h-2 rounded-full blur-sm"></div>
              </div>
              <h1 className="heading-lg mb-2 text-center">Create Account</h1>
              <p className="text-neutral-600 text-center">
                Join MarocAcademy and start your learning journey
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="etudiant">Student</option>
                  <option value="instructeur">Instructor</option>
                </select>
              </div>

              {/* Conditional fields for instructors */}
              {formData.role === 'instructeur' && (
                <>
                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Bio
                    </label>
                    <div className="relative">
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Tell us about yourself"
                        rows="3"
                        required={formData.role === 'instructeur'}
                      ></textarea>
                      <FiInfo className="absolute left-3 top-6 text-neutral-400" />
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Specialization
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="specialite"
                        value={formData.specialite}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Your area of expertise"
                        required={formData.role === 'instructeur'}
                      />
                      <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                    </div>
                  </div>
                </>
              )}

              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Profile Image (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <FiImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Profile preview" 
                      className="h-20 w-20 object-cover rounded-full mx-auto border-2 border-primary" 
                    />
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-md border ${
                      formData.password && !passwordMatch ? 'border-red-500' : 'border-neutral-300'
                    } focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="Create a password (min. 6 characters)"
                    required
                  />
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-md border ${
                      formData.password_confirmation && !passwordMatch ? 'border-red-500' : 'border-neutral-300'
                    } focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="Confirm your password"
                    required
                  />
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
                {formData.password_confirmation && !passwordMatch && (
                  <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-sm text-neutral-700"
                >
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="text-primary hover:text-primary-dark"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-primary hover:text-primary-dark"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn-primary w-full py-3 relative"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-neutral-600 mt-6">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;