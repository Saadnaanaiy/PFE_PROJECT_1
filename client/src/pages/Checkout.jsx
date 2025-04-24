import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiLock,
  FiChevronLeft,
  FiShield,
} from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import morocademyIcon from '../assets/morocademy.ico';
import CheckoutItem from '../components/CheckoutItem';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  // In a real app, this would come from a cart context
  const cartItems = [
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
  ];

  // Calculate total
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process payment and redirect
    navigate('/payment-success');
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 relative">
      {/* Decorative background elements */}
      <div
        className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0"
        style={{
          backgroundImage: `url(${moroccanPattern})`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          opacity: 0.05,
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>

      <div className="container-custom relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center"
        >
          <img
            src={morocademyIcon}
            alt="MarocAcademy"
            className="w-10 h-10 mr-3"
          />
          <div>
            <h1 className="heading-lg mb-1">Checkout</h1>
            <div className="flex items-center text-neutral-600">
              <Link to="/cart" className="flex items-center hover:text-primary">
                <FiChevronLeft className="mr-1" />
                Back to Cart
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  step >= 1 ? 'bg-primary' : 'bg-neutral-300'
                }`}
              >
                1
              </div>
              <div
                className={`h-1 w-16 md:w-32 ${
                  step >= 2 ? 'bg-primary' : 'bg-neutral-300'
                }`}
              ></div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? 'bg-primary text-white'
                    : 'bg-neutral-300 text-white'
                }`}
              >
                2
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-center w-24 md:w-40">
              <span
                className={`text-sm ${
                  step === 1 ? 'text-primary font-medium' : 'text-neutral-600'
                }`}
              >
                Shipping
              </span>
            </div>
            <div className="text-center w-24 md:w-40">
              <span
                className={`text-sm ${
                  step === 2 ? 'text-primary font-medium' : 'text-neutral-600'
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-2">
            <motion.div
              className="bg-white rounded-xl shadow-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Decorative header */}
              <div className="h-3 bg-gradient-to-r from-[#C1272D] via-[#006233] to-[#C1272D]"></div>

              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div className="p-8">
                  <h2 className="font-heading text-xl font-semibold mb-6 flex items-center">
                    <FiMapPin className="mr-2 text-primary" />
                    Shipping Information
                  </h2>

                  <form onSubmit={handleNext} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          First Name*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Last Name*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address*
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number*
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="e.g. +212 612 345678"
                          required
                        />
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Address*
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          City*
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Postal Code*
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="btn-primary w-full py-4">
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <div className="p-8">
                  <h2 className="font-heading text-xl font-semibold mb-6 flex items-center">
                    <FiCreditCard className="mr-2 text-primary" />
                    Payment Information
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-6 flex items-start">
                      <FiShield className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <p className="text-sm text-neutral-700">
                        Your payment information is encrypted and secure. We
                        respect your privacy and protect your financial
                        information.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Card Number*
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                        <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Expiration Date*
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          CVV*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="123"
                            required
                          />
                          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Name on Card*
                      </label>
                      <input
                        type="text"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Full name as displayed on card"
                        required
                      />
                    </div>

                    <div className="pt-4 flex flex-col space-y-4">
                      <button type="submit" className="btn-primary w-full py-4">
                        Complete Payment
                      </button>
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="btn w-full py-4 border border-neutral-300"
                      >
                        Back to Shipping
                      </button>

                      <p className="text-center text-sm text-neutral-600 flex items-center justify-center">
                        <FiLock className="mr-2" />
                        Your payment is secure and encrypted
                      </p>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <motion.div
              className="bg-white rounded-xl shadow-card overflow-hidden sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Decorative header */}
              <div className="h-3 bg-gradient-to-r from-[#C1272D] via-[#006233] to-[#C1272D]"></div>

              <div className="p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">
                  Order Summary
                </h2>

                <div className="divide-y divide-neutral-200 mb-4">
                  {cartItems.map((item) => (
                    <CheckoutItem key={item.id} item={item} />
                  ))}
                </div>

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

                {/* Moroccan styled design element */}
                <div className="py-4 px-3 bg-primary/5 rounded-lg border border-primary/20 mt-6 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url(${moroccanPattern})`,
                      backgroundSize: '80px',
                      backgroundRepeat: 'repeat',
                    }}
                  ></div>
                  <p className="text-center text-sm relative z-10">
                    <span className="font-semibold">
                      Thank you for choosing MarocAcademy!
                    </span>
                    <br />
                    <span className="text-primary">
                      اختر التعلم، اختر المغرب
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
