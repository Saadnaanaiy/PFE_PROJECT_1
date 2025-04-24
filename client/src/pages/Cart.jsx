import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiChevronLeft, FiTrash2 } from 'react-icons/fi';
import CartItem from '../components/CartItem';

const Cart = () => {
  const navigate = useNavigate();

  // In a real app, this would come from a context or state management
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Mohammed Bennani',
      price: 199,
      originalPrice: 899,
      quantity: 1,
      image:
        'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: '2',
      title: 'Arabic Calligraphy Masterclass',
      instructor: 'Fatima Zahra',
      price: 149,
      originalPrice: 499,
      quantity: 1,
      image:
        'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal + tax;

  return (
    <div className="bg-neutral-50 py-12">
      <div className="container-custom">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="heading-lg mb-2">Your Cart</h1>
          <div className="flex items-center text-neutral-600">
            <Link to="/" className="flex items-center hover:text-primary">
              <FiChevronLeft className="mr-1" />
              Continue Shopping
            </Link>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="ml-auto flex items-center text-red-500 hover:text-red-600"
              >
                <FiTrash2 className="mr-1" />
                Clear Cart
              </button>
            )}
          </div>
        </motion.div>

        {/* Cart Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-card p-6">
              {cartItems.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="flex justify-center mb-4">
                    <FiShoppingBag className="w-16 h-16 text-neutral-300" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Looks like you haven't added any courses to your cart yet.
                  </p>
                  <Link to="/" className="btn-primary py-2.5 px-6">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
                <h2 className="font-heading text-xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 text-neutral-600 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (20%)</span>
                    <span>{tax.toFixed(2)} MAD</span>
                  </div>
                  <div className="h-px bg-neutral-200 my-2"></div>
                  <div className="flex justify-between font-bold text-neutral-800">
                    <span>Total</span>
                    <span>{total.toFixed(2)} MAD</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full py-3"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-sm text-center text-neutral-500">
                  Secure payment powered by Moroccan payment providers
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
