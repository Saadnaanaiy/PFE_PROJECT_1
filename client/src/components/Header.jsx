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
// Import graduation cap icon and admin shield icon
import { FaGraduationCap, FaShieldAlt } from 'react-icons/fa';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { getCartItems } from '../services/cartService';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { user, isAuthenticated, logout, isInstructor, isAdmin, cartUpdateFlag } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  // Fetch cart items count when component mounts, authentication changes, or cart is updated
  useEffect(() => {
    const fetchCartCount = async () => {
      if (isAuthenticated() && !isInstructor() && !isAdmin()) {
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

    fetchCartCount();
  }, [isAuthenticated, isInstructor, isAdmin, cartUpdateFlag]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Get the appropriate icon based on user role
  const getUserRoleIcon = () => {
    if (isAdmin()) {
      return <FaShieldAlt className="w-4 h-4 text-primary" />; // Shield icon for admins
    } else if (isInstructor()) {
      return <FaGraduationCap className="w-4 h-4 text-primary" />; // Graduation cap for instructors
    } else {
      return <FiUser className="w-4 h-4 text-primary" />; // Default user icon for students
    }
  };

  // Get role display text
  const getUserRoleText = () => {
    if (isAdmin()) {
      return 'Administrator';
    } else if (isInstructor()) {
      return 'Instructor';
    } else {
      return 'Student';
    }
  };

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
              {!(isAuthenticated() && isAdmin()) && (
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
                  {isAuthenticated() && isInstructor() ? (
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
              {isAuthenticated() ? (
                <>
                  {/* Cart Icon (Hide for admins and instructors) */}
                  {!isInstructor() && !isAdmin() && (
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
                      <span className="font-medium">{user?.nom || 'User'}</span>
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
                                {user?.nom || 'User'}
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
                        {isAdmin() && (
                          <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        {isInstructor() && !isAdmin() && (
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
            {isAuthenticated() && !isAdmin() && !isInstructor() && (
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
            {isAuthenticated() && (
              <div className="px-4 py-3 border-b border-neutral-200 mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                    {getUserRoleIcon()}
                  </div>
                  <div>
                    <p className="font-medium">{user?.nom || 'User'}</p>
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
              {!(isAuthenticated() && isAdmin()) && (
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
                  {isAuthenticated() && isInstructor() ? (
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

              {isAuthenticated() ? (
                <>
                  {/* Cart Link for Mobile */}
                  {!isInstructor() && !isAdmin() && (
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
                  {isAdmin() && (
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
