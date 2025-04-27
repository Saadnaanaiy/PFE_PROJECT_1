import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiInfo, FiBook, FiImage, FiEye, FiEyeOff, FiUpload } from 'react-icons/fi';
import morocademyIcon from '../assets/morocademy.ico';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'etudiant',
    bio: '',
    specialite: '',
    image: null,
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fileName, setFileName] = useState('');

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
        
        // Save file name for display
        setFileName(files[0].name);
        
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

  const validateStep1 = () => {
    if (!formData.nom || !formData.email || !formData.role) {
      setError('Please fill in all required fields');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.password_confirmation) {
      setError('Password fields are required');
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
    if (formData.role === 'instructeur' && (!formData.bio || !formData.specialite)) {
      setError('Bio and specialization are required for instructors');
      return false;
    }
    
    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleFileButtonClick = () => {
    // Trigger hidden file input click
    document.getElementById('file-upload').click();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) return;

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
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-white rounded-xl shadow-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="p-8 border-b border-neutral-100">
              <div className="flex flex-col items-center mb-4">
                <div className="relative mb-4">
                  <div className="w-20 h-20 relative">
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

              {/* Progress indicator */}
              <div className="flex items-center justify-center mt-6">
                <div className="flex items-center w-full max-w-xs">
                  <div className={`w-1/2 h-1 rounded-l-full ${currentStep === 1 ? 'bg-primary' : 'bg-primary'}`}></div>
                  <div className={`w-1/2 h-1 rounded-r-full ${currentStep === 2 ? 'bg-primary' : 'bg-neutral-300'}`}></div>
                </div>
                <div className="ml-4 text-sm font-medium text-neutral-600">
                  Step {currentStep} of 2
                </div>
              </div>
            </div>

            {error && (
              <div className="mx-8 mt-6 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit}>
              <div className="p-8">
                {currentStep === 1 ? (
                  /* Step 1: Basic Information */
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
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
                        Email Address <span className="text-red-500">*</span>
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
                        Role <span className="text-red-500">*</span>
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

                    {/* Profile Image - Enhanced Styling */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Profile Image (Optional)
                      </label>
                      <div className="flex flex-col space-y-4">
                        {/* Hidden actual file input */}
                        <input
                          type="file"
                          id="file-upload"
                          name="image"
                          onChange={handleChange}
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          className="hidden"
                        />
                        
                        {/* Styled button to trigger file selection */}
                        <button
                          type="button"
                          onClick={handleFileButtonClick}
                          className="flex items-center justify-center space-x-2 w-full py-3 px-4 border border-dashed border-primary bg-primary/5 rounded-md hover:bg-primary/10 transition-colors duration-200"
                        >
                          <FiUpload className="text-primary" />
                          <span className="text-primary font-medium">
                            {fileName ? 'Change Profile Picture' : 'Upload Profile Picture'}
                          </span>
                        </button>
                        
                        {/* File name display */}
                        {fileName && (
                          <div className="flex items-center space-x-2 text-sm text-neutral-600 pl-2">
                            <FiImage className="text-neutral-400" />
                            <span className="truncate max-w-full">{fileName}</span>
                          </div>
                        )}
                        
                        {/* Image preview */}
                        {previewImage && (
                          <div className="flex justify-center mt-2">
                            <div className="relative">
                              <img 
                                src={previewImage} 
                                alt="Profile preview" 
                                className="h-24 w-24 object-cover rounded-full border-2 border-primary" 
                              />
                              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse -z-10"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Step 2: Security and Additional Information */
                  <div className="space-y-6">
                    {/* Password with toggle visibility */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-12 py-3 rounded-md border ${
                            formData.password && !passwordMatch ? 'border-red-500' : 'border-neutral-300'
                          } focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder="Create a password (min. 6 characters)"
                          required
                        />
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        
                        {/* Toggle password visibility button */}
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary"
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password with toggle visibility */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-12 py-3 rounded-md border ${
                            formData.password_confirmation && !passwordMatch ? 'border-red-500' : 'border-neutral-300'
                          } focus:ring-2 focus:ring-primary focus:border-transparent`}
                          placeholder="Confirm your password"
                          required
                        />
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        
                        {/* Toggle confirm password visibility button */}
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary"
                        >
                          {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      {formData.password_confirmation && !passwordMatch && (
                        <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                      )}
                    </div>

                    {/* Conditional fields for instructors */}
                    {formData.role === 'instructeur' && (
                      <>
                        {/* Bio */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Bio <span className="text-red-500">*</span>
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
                            Specialization <span className="text-red-500">*</span>
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
                  </div>
                )}
              </div>

              {/* Footer with buttons */}
              <div className="p-8 border-t border-neutral-100 flex justify-between">
                {currentStep === 2 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-outline px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-neutral-100"
                  >
                    Back
                  </button>
                ) : (
                  <div></div> // Empty div to maintain spacing
                )}

                {currentStep === 1 ? (
                  <button 
                    type="submit" 
                    className="btn-primary px-8 py-3 rounded-lg font-medium flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="btn-primary px-8 py-3 rounded-lg font-medium flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </div>

              {/* Login Link */}
              <div className="p-4 text-center">
                <p className="text-sm text-neutral-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;