import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import morocademyIcon from '../assets/morocademy.ico';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    role: 'student' // Added role field with default value
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password' || name === 'confirmPassword') {
      const otherField = name === 'password' ? formData.confirmPassword : formData.password;
      setPasswordMatch(value === otherField);
    }
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
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
      
      const response = await axios.post('http://localhost:8000/api/register', {
        nom: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: formData.role // Added role to request
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.password) {
        setError(err.response.data.password[0]);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
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
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

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
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

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
                    placeholder="Create a password"
                    required
                  />
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-md border ${
                      formData.confirmPassword && !passwordMatch ? 'border-red-500' : 'border-neutral-300'
                    } focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="Confirm your password"
                    required
                  />
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
                {formData.confirmPassword && !passwordMatch && (
                  <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                )}
              </div>

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

              <button 
                type="submit" 
                className="btn-primary w-full py-3 relative"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

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
