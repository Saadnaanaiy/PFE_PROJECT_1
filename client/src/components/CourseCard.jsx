import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiClock, FiShoppingCart, FiUsers, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const getLevelColor = (niveau) => {
  switch (niveau?.toLowerCase()) {
    case 'débutant':
      return 'bg-green-100 text-green-800';
    case 'intermédiaire':
      return 'bg-blue-100 text-blue-800';
    case 'avancé':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const fixImagePath = (imagePath) => {
  const storagePrefix = 'http://localhost:8000/storage/';
  if (imagePath && imagePath.includes(storagePrefix + storagePrefix)) {
    return imagePath.replace(storagePrefix + storagePrefix, storagePrefix);
  }
  return imagePath;
};

const AuthModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Login Required</h3>
        <p className="text-neutral-600 mb-6">
          You need to be logged in to add courses to your cart. Would you like
          to log in now?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="certification-button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary hover:shadow-[-6px_0px_12px_rgba(0,98,51,0.6)]"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsAddingToCart(true);

      // Try to add to cart - this will return 401 if not authenticated
      const response = await axios.post('/api/cart/add', {
        cours_id: course.id,
        price: course.prix,
      });

      console.log(response);

      // If successful, show success message
      toast.success('Course added to cart!');
    } catch (error) {
      // If 401 Unauthorized, open auth modal
      if (error.response && error.response.status === 401) {
        setIsAuthModalOpen(true);
      }
      // If 409 Conflict, course is already in cart
      else if (error.response && error.response.status === 409) {
        toast.info('This course is already in your cart');
      } else {
        // Handle other errors
        toast.error('Failed to add course to cart');
        console.error('Error adding to cart:', error);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAuthModalConfirm = () => {
    setIsAuthModalOpen(false);
    // Store intended action in session/local storage
    localStorage.setItem('cartPendingCourseId', course.id);
    // Redirect to login page
    navigate('/login', { state: { from: window.location.pathname } });
  };

  return (
    <>
      <Link
        to={`/courses/${course.id}`}
        className="block bg-white rounded-xl shadow-card overflow-hidden hover:shadow-xl transition-shadow"
      >
        <div className="relative h-48">
          <img
            src={fixImagePath(course.image)}
            alt={course.titre}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3">
            {course.categorie && (
              <span className="px-3 py-1 bg-green-500 bg-opacity-80 text-white backdrop-blur-sm rounded-full text-sm font-medium text-neutral-800">
                {course.categorie.nom}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-sm text-primary hover:text-primary-dark transition-colors"
            aria-label="Add to cart"
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiShoppingCart size={20} />
            )}
          </button>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {course.titre}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            {course.instructeur?.image ? (
              <img
                src={fixImagePath(course.instructeur.image)}
                alt={course.instructeur.user?.nom}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium text-xs">
                  {course.instructeur?.user?.nom?.charAt(0) || 'I'}
                </span>
              </div>
            )}
            <p className="text-sm text-neutral-600">
              {course.instructeur?.user?.nom}
            </p>
          </div>
          <div className="flex items-center text-sm mb-3">
            <div className="flex items-center mr-3">
              <FiClock className="text-neutral-400 mr-1" />
              <span className="text-neutral-600">
                {(course.dureeMinutes / 60).toFixed(1)}h
              </span>
            </div>
            <div className="flex items-center mr-3">
              <FiUsers className="text-neutral-400 mr-1" />
              <span className="text-neutral-600">
                {course.etudiants_count || 0}
              </span>
            </div>
            <div className="flex items-center">
              <FiStar className="text-yellow-400 mr-1" />
              <span className="text-neutral-600">{course.rating || 4.5}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                course.niveau,
              )}`}
            >
              {course.niveau}
            </span>
            <span className="text-lg font-semibold text-primary">
              {course.prix === 0 ? 'Free' : `${course.prix} MAD`}
            </span>
          </div>
        </div>
      </Link>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onConfirm={handleAuthModalConfirm}
      />
    </>
  );
};

export default CourseCard;
