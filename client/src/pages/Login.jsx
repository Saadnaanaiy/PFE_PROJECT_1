import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import morocademyIcon from '../assets/morocademy.ico';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError } = useAuth();
  
  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password, rememberMe);
      navigate(from);
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
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
              <h1 className="heading-lg mb-2 text-center">Welcome Back</h1>
              <p className="text-neutral-600 text-center">
                Continue your learning journey with MarocAcademy
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-neutral-700"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className={`btn-primary w-full py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-neutral-600 mt-6">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;