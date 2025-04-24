import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiHome, FiBookOpen } from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import morocademyIcon from '../assets/morocademy.ico';

const PaymentSuccess = () => {
  const [orderNumber] = useState(
    `MAR-${Math.floor(100000 + Math.random() * 900000)}`,
  );
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-neutral-50 py-16 relative">
      {/* Decorative background elements */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${moroccanPattern})`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          opacity: 0.03,
        }}
      ></div>

      <div className="container-custom relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-white rounded-xl shadow-card overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-3 bg-gradient-to-r from-[#C1272D] via-[#006233] to-[#C1272D]"></div>

            <div className="p-8 md:p-12">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 relative">
                  <img
                    src={morocademyIcon}
                    alt="MarocAcademy"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute -inset-1 bg-primary/10 rounded-full -z-10 animate-pulse"></div>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <FiCheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="heading-lg mb-2">Payment Successful!</h1>
                <p className="text-neutral-600">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-lg p-6 mb-8 border border-neutral-200">
                <h2 className="font-heading text-lg font-semibold mb-3 text-center">
                  Order Details
                </h2>
                <div className="divide-y divide-dashed divide-neutral-200">
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-600">Order Number:</span>
                    <span className="font-medium">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-600">Date:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-600">Payment Method:</span>
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-600">Total Amount:</span>
                    <span className="font-medium">348.00 MAD</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-center text-sm text-neutral-600 mb-6">
                  A confirmation email has been sent to your email address. You
                  will be redirected to your courses in {countdown} seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/my-courses"
                    className="btn-primary py-3 px-6 flex items-center justify-center"
                  >
                    <FiBookOpen className="mr-2" />
                    Go to My Courses
                  </Link>
                  <Link
                    to="/"
                    className="btn py-3 px-6 border border-neutral-300 flex items-center justify-center"
                  >
                    <FiHome className="mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Moroccan themed footer */}
              <div className="mt-10 pt-6 border-t border-neutral-200">
                <div className="py-4 text-center relative">
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `url(${moroccanPattern})`,
                      backgroundSize: '80px',
                      backgroundRepeat: 'repeat',
                    }}
                  ></div>
                  <p className="text-sm font-medium">
                    <span className="text-primary">شكرا لك!</span> - Thank you!
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Begin your learning journey with MarocAcademy
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
