import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'
import Logo from './Logo'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20)
    })
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
              <Link to="/categories" className="text-neutral-800 hover:text-primary font-medium">
                Categories
              </Link>
              <Link to="/courses" className="text-neutral-800 hover:text-primary font-medium">
                Courses
              </Link>
              <Link to="/instructors" className="text-neutral-800 hover:text-primary font-medium">
                Instructors
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <FiShoppingCart className="w-6 h-6 text-neutral-800 hover:text-primary" />
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </Link>
              <Link to="/login" className="btn-outline py-1.5">
                Log in
              </Link>
              <Link to="/register" className="btn-primary py-1.5">
                Sign up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative mr-4">
              <FiShoppingCart className="w-6 h-6 text-neutral-800" />
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Link>
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
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search for courses..."
                className="pl-10 pr-4 py-2 w-full rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            </div>
            <div className="flex flex-col space-y-4 pb-4">
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
              <Link
                to="/instructors"
                className="text-neutral-800 hover:text-primary font-medium px-1 py-2 border-b border-neutral-200"
                onClick={() => setIsOpen(false)}
              >
                Instructors
              </Link>
              <div className="flex items-center pt-2 space-x-4">
                <Link to="/login" className="btn-outline py-1.5 flex-1 text-center">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary py-1.5 flex-1 text-center">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
