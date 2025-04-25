import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
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
    <div className="bg-neutral-50 py-12 min-h-screen">
      <div className="container-custom">
        {/* Page Header */}
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
                <FiArrowLeft className="mr-2" size={16} />
                Continue Shopping
              </Link>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="ml-8 flex items-center text-neutral-600 hover:text-red-500 transition-colors"
                >
                  <FiTrash2 className="mr-2" size={16} />
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cart Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cartItems.length > 0 ? (
                <div className="divide-y divide-neutral-100">
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

          {/* Order Summary */}
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
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full py-3 rounded-md hover:bg-primary-dark transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6 text-center text-sm text-neutral-500 bg-neutral-50 rounded-md p-3">
                  Secure checkout powered by trusted payment providers
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
