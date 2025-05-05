import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import CartItem from '../components/CartItem';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch cart from API
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      console.log('Cart API response:', response.data);

      // Use the complete course objects from API to maintain all data including instructeur and categorie
      setCartItems(
        response.data.cours.map((item) => {
          return {
            ...item,
            id: item.id,
            title: item.titre || 'Unnamed Course',
            price: item.prix || 0,
            quantity: item.pivot?.quantity || 1,
            image: item.image || '/placeholder-course.jpg',
            originalPrice: null,
          };
        }),
      );
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart items.');
      toast.error('Failed to load cart items.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`/api/cart/${itemId}`);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success('Item removed');
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Unable to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart');
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Unable to clear cart');
    }
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);

      // Create a Stripe checkout session
      const response = await axios.post('/api/checkout');
      console.log(response.data);

      // Redirect to Stripe's checkout page
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Unable to proceed to checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  if (loading) return <p className="text-center py-10">Loading cart...</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <div className="bg-neutral-50 py-12 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-b border-neutral-100 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="heading-lg mb-1 text-neutral-800">
                Shopping Cart
              </h1>
              <p className="text-neutral-500">
                {cartItems.length > 0
                  ? `${cartItems.length} course${
                      cartItems.length > 1 ? 's' : ''
                    } in your cart`
                  : 'Your cart is currently empty'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <Link
                to="/"
                className="flex items-center text-primary font-medium hover:text-primary-dark transition-colors"
              >
                <FiArrowLeft className="mr-2" size={16} /> Continue Shopping
              </Link>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="ml-8 flex items-center text-neutral-600 hover:text-red-500 transition-colors"
                >
                  <FiTrash2 className="mr-2" size={16} /> Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cartItems.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      removeItem={removeItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 px-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                    <FiShoppingBag className="text-primary" size={28} />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-neutral-800">
                    Your cart is empty
                  </h3>
                  <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                    Looks like you haven&apos;t added any courses to your cart
                    yet. Browse our catalog to find courses that interest you.
                  </p>
                  <Link
                    to="/"
                    className="btn-primary py-2.5 px-8 rounded-md inline-flex items-center hover:bg-primary-dark transition-colors"
                  >
                    Explore Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {cartItems.length > 0 && (
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="font-heading text-xl font-semibold mb-6 pb-3 border-b text-neutral-800">
                  Order Summary
                </h2>
                <div className="space-y-4 text-neutral-600 mb-8">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-neutral-800">
                      {subtotal.toFixed(2)} MAD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (20%)</span>
                    <span>{tax.toFixed(2)} MAD</span>
                  </div>
                  <div className="h-px bg-neutral-200 my-3"></div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(2)} MAD</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`btn-primary w-full py-3 rounded-md hover:bg-primary-dark transition-colors font-medium ${
                    isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                <div className="mt-6 text-center text-sm text-neutral-500 bg-neutral-50 rounded-md p-3">
                  Secure checkout powered by Stripe
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
