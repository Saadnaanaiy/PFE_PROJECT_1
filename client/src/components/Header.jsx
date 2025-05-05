import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';
import { FaGraduationCap, FaShieldAlt } from 'react-icons/fa';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { getCartItems } from '../services/cartService';
import axios from 'axios';

// Create a custom event for cart updates
export const cartUpdatedEvent = new Event('cartUpdated');

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [localAuthState, setLocalAuthState] = useState({
    isAuthenticated: false,
    userData: null,
    userRole: null,
    isLoading: true,
  });

  const {
    user,
    loading,
    isAuthenticated,
    logout,
    isInstructor,
    isAdmin,
    cartUpdateFlag,
  } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Enhanced authentication check that works independently
  useEffect(() => {
    const checkAuthDirectly = async () => {
      try {
        // First check if we have a token
        const token =
          localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          setLocalAuthState({
            isAuthenticated: false,
            userData: null,
            userRole: null,
            isLoading: false,
          });
          return;
        }

        // Try to fetch user data directly with the token
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setLocalAuthState({
            isAuthenticated: true,
            userData: response.data,
            userRole: response.data.role,
            isLoading: false,
          });
        } else {
          throw new Error('No user data returned');
        }
      } catch (err) {
        console.error('Direct auth check failed:', err);
        setLocalAuthState({
          isAuthenticated: false,
          userData: null,
          userRole: null,
          isLoading: false,
        });
      }
    };

    // First try to use context auth data if available
    if (!loading && user) {
      setLocalAuthState({
        isAuthenticated: true,
        userData: user,
        userRole: user.role,
        isLoading: false,
      });
    }
    // If context auth is done loading but no user, try direct check
    else if (!loading && !user) {
      checkAuthDirectly();
    }
    // If context is still loading, set local loading state
    else {
      setLocalAuthState((prev) => ({ ...prev, isLoading: true }));
    }
  }, [user, loading]);

  // Fetch cart items when auth state changes or when cart is updated
  const fetchCartCount = async () => {
    const isStudent =
      localAuthState.isAuthenticated &&
      localAuthState.userRole !== 'administrateur' &&
      localAuthState.userRole !== 'instructeur';

    if (isStudent) {
      try {
        const items = await getCartItems();
        setCartItemsCount(items.length);
      } catch (error) {
        console.error('Error fetching cart count:', error);
        setCartItemsCount(0);
      }
    } else {
      setCartItemsCount(0);
    }
  };

  // Effect for initial cart count and context updates
  useEffect(() => {
    if (!localAuthState.isLoading) {
      fetchCartCount();
    }
  }, [localAuthState, cartUpdateFlag]);

  // Listen for custom cart updated events
  useEffect(() => {
    // Handler for the custom event
    const handleCartUpdated = () => {
      fetchCartCount();
    };

    // Add event listener
    window.addEventListener('cartUpdated', handleCartUpdated);

    // Clean up the event listener
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, [localAuthState.isAuthenticated, localAuthState.userRole]);

  const handleLogout = async () => {
    await logout();
    setLocalAuthState({
      isAuthenticated: false,
      userData: null,
      userRole: null,
      isLoading: false,
    });
    navigate('/');
  };

  // Local role checking functions that don't depend on context
  const checkIsAdmin = () => {
    return localAuthState.userRole === 'administrateur';
  };

  const checkIsInstructor = () => {
    return localAuthState.userRole === 'instructeur';
  };

  // Get the appropriate icon based on user role
  const getUserRoleIcon = () => {
    if (checkIsAdmin()) {
      return <FaShieldAlt className="w-4 h-4 text-primary" />;
    } else if (checkIsInstructor()) {
      return <FaGraduationCap className="w-4 h-4 text-primary" />;
    } else {
      return <FiUser className="w-4 h-4 text-primary" />;
    }
  };

  // Get role display text
  const getUserRoleText = () => {
    if (checkIsAdmin()) {
      return 'Administrator';
    } else if (checkIsInstructor()) {
      return 'Instructor';
    } else {
      return 'Student';
    }
  };

  // If still loading auth state, show a simple loading state
  if (localAuthState.isLoading) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex-shrink-0">
              <Logo className="h-10 w-auto" />
            </Link>
            <div className="animate-pulse w-24 h-8 bg-neutral-200 rounded"></div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for courses..."
                className="pl-10 pr-4 py-2 w-64 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            </div>

            <div className="flex items-center space-x-6">
              {/* Don't show category/course/instructor links for admin */}
              {!(localAuthState.isAuthenticated && checkIsAdmin()) && (
                <>
                  <Link
                    to="/categories"
                    className="text-neutral-800 hover:text-primary font-medium"
                  >
                    Categories
                  </Link>
                  <Link
                    to="/courses"
                    className="text-neutral-800 hover:text-primary font-medium"
                  >
                    Courses
                  </Link>
                  {/* Conditionally show Instructors link or Dashboard link */}
                  {localAuthState.isAuthenticated && checkIsInstructor() ? (
                    <Link
                      to="/instructor/dashboard"
                      className="text-neutral-800 hover:text-primary font-medium"
                    >
                      Instructor Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/instructors"
                      className="text-neutral-800 hover:text-primary font-medium"
                    >
                      Instructors
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {localAuthState.isAuthenticated ? (
                <>
                  {/* Cart Icon (Hide for admins and instructors) */}
                  {!checkIsInstructor() && !checkIsAdmin() && (
                    <Link to="/cart" className="relative">
                      <FiShoppingCart className="w-6 h-6 text-neutral-800 hover:text-primary" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                  )}
                  {/* Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 text-neutral-800 hover:text-primary"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {getUserRoleIcon()}
                      </div>
                      <span className="font-medium">
                        {localAuthState.userData?.nom || 'User'}
                      </span>
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <div className="px-4 py-2 border-b border-neutral-200">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                              {getUserRoleIcon()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {localAuthState.userData?.nom || 'User'}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {getUserRoleText()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        {/* Show appropriate dashboard link based on role */}
                        {checkIsAdmin() && (
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        {checkIsInstructor() && !checkIsAdmin() && (
                          <Link
                            to="/instructor/dashboard"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Instructor Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Login/Signup */}
                  <Link to="/login" className="btn-outline py-1.5">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary py-1.5">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {localAuthState.isAuthenticated &&
              !checkIsAdmin() &&
              !checkIsInstructor() && (
                <Link to="/cart" className="relative mr-4">
                  <FiShoppingCart className="w-6 h-6 text-neutral-800" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-800"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 animate-fadeIn">
            {localAuthState.isAuthenticated && (
              <div className="px-4 py-3 border-b border-neutral-200 mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    {getUserRoleIcon()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {localAuthState.userData?.nom || 'User'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {getUserRoleText()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search for courses..."
                className="pl-10 pr-4 py-2 w-full rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            </div>
            <div className="flex flex-col space-y-4 pb-4">
              {/* Don't show these links for admin in mobile view either */}
              {!(localAuthState.isAuthenticated && checkIsAdmin()) && (
                <>
                  <Link
                    to="/categories"
                    className="text-neutral-800 hover:text-primary font-medium px-1 py-2 border-b border-neutral-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link
                    to="/courses"
                    className="text-neutral-800 hover:text-primary font-medium px-1 py-2 border-b border-neutral-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Courses
                  </Link>
                  {/* Conditional Mobile Link */}
                  {localAuthState.isAuthenticated && checkIsInstructor() ? (
                    <Link
                      to="/instructor/dashboard"
                      className="text-neutral-800 hover:text-primary font-medium px-1 py-2 border-b border-neutral-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Instructor Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/instructors"
                      className="text-neutral-800 hover:text-primary font-medium px-1 py-2 border-b border-neutral-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Instructors
                    </Link>
                  )}
                </>
              )}

              {localAuthState.isAuthenticated ? (
                <>
                  {/* Cart Link for Mobile */}
                  {!checkIsInstructor() && !checkIsAdmin() && (
                    <Link
                      to="/cart"
                      className="text-neutral-800 hover:text-primary font-medium px-1 py-2 border-b border-neutral-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                    </Link>
                  )}
                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className="text-neutral-800 hover:text-primary font-medium px-1 py-2 border-b border-neutral-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  {/* Admin Dashboard Link (Mobile) */}
                  {checkIsAdmin() && (
                    <Link
                      to="/admin/dashboard"
                      className="text-neutral-800 hover:text-primary font-medium px-1 py-2 border-b border-neutral-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700 font-medium px-1 py-2 border-b border-neutral-200 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login/Signup */}
                  <Link
                    to="/login"
                    className="text-neutral-800 hover:text-primary font-medium px-1 py-2 border-b border-neutral-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="text-neutral-800 hover:text-primary font-medium px-1 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
