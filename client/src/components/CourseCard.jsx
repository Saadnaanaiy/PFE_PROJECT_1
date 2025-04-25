import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiUser, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const {
    id,
    title,
    instructor,
    image,
    rating,
    reviewCount,
    duration,
    level,
    price,
    discountPrice,
    category,
  } = course;

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/course/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation to course detail
    if (!isInCart) {
      setIsInCart(true);
      setShowNotification(true);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
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
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {category && (
            <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-medium py-1 px-2 rounded">
              {category}
            </span>
          )}

          <button
            onClick={handleAddToCart}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isInCart
                ? 'bg-secondary text-white'
                : 'bg-white text-secondary hover:bg-secondary hover:text-white'
            }`}
            aria-label={isInCart ? 'Added to cart' : 'Add to cart'}
          >
            {isInCart ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
          </button>
        </div>

        <div className="p-5">
          <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-neutral-600 mb-2 flex items-center">
            <FiUser className="mr-1.5 text-neutral-500" />
            {instructor}
          </p>

          <div className="flex items-center mb-3">
            <div className="flex items-center text-amber-500">
              <FiStar className="fill-current" />
              <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
            </div>
            <span className="mx-1.5 text-neutral-300">•</span>
            <span className="text-sm text-neutral-600">
              {reviewCount} reviews
            </span>
          </div>

          <div className="flex items-center text-sm text-neutral-600 mb-4">
            <FiClock className="mr-1.5" />
            <span>{duration}</span>
            <span className="mx-1.5 text-neutral-300">•</span>
            <span>{level}</span>
          </div>

          <div className="flex items-baseline">
            {discountPrice ? (
              <>
                <span className="text-xl font-bold text-secondary">
                  {discountPrice} MAD
                </span>
                <span className="ml-2 text-sm line-through text-neutral-500">
                  {price} MAD
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-neutral-900">
                {price} MAD
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

export default CourseCard;
