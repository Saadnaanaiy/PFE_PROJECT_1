import React from 'react';
import { FiTrash2, FiTag } from 'react-icons/fi';

const CartItem = ({ item, removeItem }) => {
  // Safely access nested properties
  const categoryName = item.categorie?.nom || 'Uncategorized';
  const instructorName = item.instructeur?.user?.nom || 'Unknown Instructor';
  const instructorImage =
    item.instructeur.image || '/placeholder-avatar.jpg';

  return (
    <div className="p-5 hover:bg-neutral-50 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Course Image */}
        <div className="sm:w-32 w-full h-24 sm:h-20 flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg shadow-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row flex-grow justify-between">
          {/* Course Info */}
          <div className="flex-grow pr-4">
            <h3 className="font-medium text-neutral-800 mb-1 line-clamp-1">
              {item.title || item.titre}
            </h3>

            {/* Category Badge */}
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <FiTag className="mr-1 w-3 h-3" />
                {categoryName}
              </span>
            </div>

            {/* Instructor Info with Image */}
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                <img
                  src={instructorImage}
                  alt={instructorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-neutral-500">By {instructorName}</p>
            </div>

            {/* Mobile Remove Button */}
            <button
              onClick={() => removeItem(item.id)}
              className="sm:hidden text-neutral-400 hover:text-red-500 transition-colors flex items-center text-sm mt-2"
              aria-label="Remove item"
            >
              <FiTrash2 className="w-4 h-4 mr-1" /> Remove
            </button>
          </div>

          {/* Price & Desktop Remove Button */}
          <div className="flex items-center justify-between sm:justify-end mt-4 sm:mt-0">
            <div className="flex flex-col items-end min-w-[80px]">
              <span className="font-bold text-secondary">
                {item.price || item.prix} MAD
              </span>
              {item.originalPrice && (
                <span className="text-xs line-through text-neutral-400">
                  {item.originalPrice} MAD
                </span>
              )}
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="hidden sm:block ml-4 text-neutral-400 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
