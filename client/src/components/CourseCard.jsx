import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiUser,
  FiShoppingCart,
  FiCheck,
  FiPlay,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { checkInCart, addToCart } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';

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

// Function to fix duplicate URL prefixes in image paths
const fixImagePath = (imagePath) => {
  if (!imagePath) return '';

  // Remove duplicate "http://localhost:8000/storage/" prefix
  const storagePrefix = 'http://localhost:8000/storage/';
  if (imagePath.includes(storagePrefix + storagePrefix)) {
    return imagePath.replace(storagePrefix + storagePrefix, storagePrefix);
  }
  return imagePath;
};

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCourseFree, setIsCourseFree] = useState(false);
  const { cartUpdated } = useAuth();
  const {
    id,
    titre,
    instructeur,
    image,
    dureeMinutes,
    dureeHeures, // New property for hours
    niveau,
    prix,
    prix_original,
    categorie,
    sections,
  } = course;

  // Calculate hours if dureeHeures is not provided but dureeMinutes is
  const displayHours =
    dureeHeures || (dureeMinutes ? (dureeMinutes / 60).toFixed(1) : 0);

  useEffect(() => {
    // Check if the course is in the cart on component mount
    const checkCartStatus = async () => {
      try {
        const inCart = await checkInCart(id);
        setIsInCart(inCart);
      } catch (error) {
        console.error('Error checking cart status:', error);
      }
    };

    checkCartStatus();

    // Check if course is free
    checkIfCourseFree();
  }, [id]);

  // Check if all lessons in the course are free
  const checkIfCourseFree = () => {
    // If price is 0, it's free
    if (prix === 0) {
      setIsCourseFree(true);
      return;
    }

    // If no sections data is available, rely only on price
    if (!sections || sections.length === 0) {
      setIsCourseFree(false);
      return;
    }

    // Otherwise check all lessons
    let allLessonsFree = true;

    // Loop through all sections and their lessons
    for (const section of sections) {
      if (!section.lecons || section.lecons.length === 0) continue;

      for (const lecon of section.lecons) {
        if (!lecon.estGratuite) {
          allLessonsFree = false;
          break;
        }
      }

      if (!allLessonsFree) break;
    }

    setIsCourseFree(allLessonsFree);
  };

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/course/${id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigation to course detail

    // If course is free, navigate directly to the learning page
    if (isCourseFree) {
      navigate(`/course/${id}/learn`);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!isInCart && !loading) {
      try {
        setLoading(true);

        const result = await addToCart(id);

        if (result.success) {
          setIsInCart(true);
          setShowNotification(true);

          // Notify other components about cart update
          cartUpdated();

          // Hide notification after 3 seconds
          setTimeout(() => {
            setShowNotification(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      className="course-card group relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      <div className="block cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={fixImagePath(image)}
            alt={titre}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {categorie && (
            <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-medium py-1 px-2 rounded">
              {categorie.nom}
            </span>
          )}

          <button
            onClick={handleAddToCart}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isCourseFree
                ? 'bg-green-500 text-white'
                : isInCart
                ? 'bg-secondary text-white'
                : 'bg-white text-secondary hover:bg-secondary hover:text-white'
            }`}
            aria-label={
              isCourseFree
                ? 'Go to Course'
                : isInCart
                ? 'Added to cart'
                : 'Add to cart'
            }
          >
            {isCourseFree ? (
              <FiPlay size={18} />
            ) : isInCart ? (
              <FiCheck size={18} />
            ) : (
              <FiShoppingCart size={18} />
            )}
          </button>
        </div>

        <div className="p-5">
          <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {titre}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            {instructeur?.image ? (
              <img
                src={fixImagePath(instructeur.image)}
                alt={instructeur.user?.nom}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <FiUser className="text-primary text-sm" />
              </div>
            )}
            <p className="text-sm text-neutral-600">{instructeur?.user?.nom}</p>
          </div>

          <div className="flex items-center text-sm text-neutral-600 mb-4">
            <FiClock className="mr-1.5" />
            <span>{displayHours} hours</span>
            <span className="mx-1.5 text-neutral-300">•</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                niveau,
              )}`}
            >
              {niveau}
            </span>
          </div>

          <div className="flex items-baseline">
            {isCourseFree ? (
              <span className="text-xl font-bold text-green-600">Free</span>
            ) : prix_original ? (
              <>
                <span className="text-xl font-bold text-secondary">
                  {prix} MAD
                </span>
                <span className="ml-2 text-sm line-through text-neutral-500">
                  {prix_original} MAD
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-neutral-900">
                {prix} MAD
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Success notification */}
      {showNotification && (
        <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg py-2 px-4 z-10 border-l-4 border-secondary transition-all duration-300 animate-fadeIn">
          <div className="flex items-center">
            <FiCheck className="text-secondary mr-2" />
            <span className="text-sm font-medium">Added to cart</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    titre: PropTypes.string.isRequired,
    instructeur: PropTypes.object,
    image: PropTypes.string.isRequired,
    dureeMinutes: PropTypes.number,
    dureeHeures: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    niveau: PropTypes.string,
    prix: PropTypes.number.isRequired,
    prix_original: PropTypes.number,
    categorie: PropTypes.object,
    sections: PropTypes.array,
  }).isRequired,
};

export default CourseCard;
