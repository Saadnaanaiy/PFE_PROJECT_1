import React from 'react';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const CartItem = ({ item, updateQuantity, removeItem }) => {
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

        {/* Course Info and Controls Wrapper */}
        <div className="flex flex-col sm:flex-row flex-grow justify-between">
          {/* Course Info */}
          <div className="flex-grow pr-4">
            <h3 className="font-medium text-neutral-800 mb-1 line-clamp-1">
              {item.title}
            </h3>
            <p className="text-sm text-neutral-500 mb-2">
              By {item.instructor}
            </p>

            {/* Remove button - Mobile */}
            <button
              onClick={() => removeItem(item.id)}
              className="sm:hidden text-neutral-400 hover:text-red-500 transition-colors flex items-center text-sm"
              aria-label="Remove item"
            >
              <FiTrash2 className="w-4 h-4 mr-1" />
              <span>Remove</span>
            </button>
          </div>

          {/* Price and Controls */}
          <div className="flex items-center justify-between sm:justify-end mt-4 sm:mt-0">
            {/* Quantity Controls */}
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-2 text-neutral-600 disabled:opacity-50 disabled:bg-neutral-50 hover:bg-neutral-100 transition-colors"
              >
                <FiMinus className="w-3 h-3" />
              </button>
              <span className="px-3 py-1 font-medium text-sm text-neutral-800 bg-white">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <FiPlus className="w-3 h-3" />
              </button>
            </div>

            {/* Price */}
            <div className="flex flex-col items-end ml-6 min-w-[80px]">
              <span className="font-bold text-secondary">{item.price} MAD</span>
              {item.originalPrice && (
                <span className="text-xs line-through text-neutral-400">
                  {item.originalPrice} MAD
                </span>
              )}
            </div>

            {/* Remove button - Desktop */}
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
