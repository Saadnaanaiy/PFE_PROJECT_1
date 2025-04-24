import React from 'react';

const CheckoutItem = ({ item }) => {
  return (
    <div className="py-3 flex">
      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-3 flex-grow">
        <h4 className="text-sm font-medium text-neutral-800 line-clamp-2">
          {item.title}
        </h4>
        <p className="text-xs text-neutral-500 mt-1">
          By {item.instructor}
        </p>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neutral-500">
            Qty: {item.quantity}
          </span>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-secondary">
              {item.price} MAD
            </span>
            {item.originalPrice && (
              <span className="text-xs line-through text-neutral-400">
                {item.originalPrice} MAD
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutItem;
