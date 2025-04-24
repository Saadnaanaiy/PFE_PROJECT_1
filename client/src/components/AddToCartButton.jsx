import { useState } from 'react'
import { FiShoppingCart, FiCheck } from 'react-icons/fi'

const AddToCartButton = ({ courseId, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    // In a real app, this would interact with a cart context/state management
    onAddToCart(courseId)
    setIsAdded(true)

    // Reset after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center px-4 py-2 rounded-lg border transition-colors ${
        isAdded
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-white text-primary border-primary hover:bg-primary/5'
      }`}
    >
      {isAdded ? (
        <>
          <FiCheck className="mr-2" />
          Added to Cart
        </>
      ) : (
        <>
          <FiShoppingCart className="mr-2" />
          Add to Cart
        </>
      )}
    </button>
  )
}

export default AddToCartButton
