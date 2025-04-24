import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="flex border-b border-neutral-200 py-4">
      {/* Course Image */}
      <div className="w-24 h-16 flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Course Info */}
      <div className="ml-4 flex-grow">
        <h3 className="font-medium text-neutral-800">{item.title}</h3>
        <p className="text-sm text-neutral-500">By {item.instructor}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center mr-4">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-1 rounded-full border border-neutral-300 text-neutral-600 disabled:opacity-50"
        >
          <FiMinus className="w-4 h-4" />
        </button>
        <span className="mx-2 w-6 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1 rounded-full border border-neutral-300 text-neutral-600"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Price */}
      <div className="flex flex-col items-end min-w-[80px]">
        <span className="font-bold text-secondary">{item.price} MAD</span>
        {item.originalPrice && (
          <span className="text-sm line-through text-neutral-500">{item.originalPrice} MAD</span>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={() => removeItem(item.id)}
        className="ml-4 text-neutral-500 hover:text-red-500"
        aria-label="Remove item"
      >
        <FiTrash2 className="w-5 h-5" />
      </button>
    </div>
  )
}

export default CartItem
