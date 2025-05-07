import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';

const CheckoutResult = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'unknown';
  const transactionId = searchParams.get('transaction_id');
  const errorMessage = searchParams.get('message');

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [icon, setIcon] = useState(null);
  const [iconBgColor, setIconBgColor] = useState('');
  const [iconColor, setIconColor] = useState('');

  // Animation states
  const [showIcon, setShowIcon] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    switch (status) {
      case 'success':
        setTitle('Payment Successful!');
        setMessage(
          'Thank you for your purchase. Your courses are now available in your learning dashboard.',
        );
        setIcon(<FiCheck size={32} />);
        setIconBgColor('bg-green-100');
        setIconColor('text-green-500');
        break;

      case 'cancelled':
        setTitle('Payment Cancelled');
        setMessage(
          'Your payment was cancelled. Your cart items are still saved if you wish to complete the purchase later.',
        );
        setIcon(<FiX size={32} />);
        setIconBgColor('bg-yellow-100');
        setIconColor('text-yellow-500');
        break;

      case 'error':
        setTitle('Payment Error');
        setMessage(
          errorMessage ||
            'There was an error processing your payment. Please try again or contact support if the issue persists.',
        );
        setIcon(<FiAlertTriangle size={32} />);
        setIconBgColor('bg-red-100');
        setIconColor('text-red-500');
        break;

      default:
        setTitle('Payment Status Unknown');
        setMessage(
          'The status of your payment could not be determined. Please check your account to verify.',
        );
        setIcon(<FiAlertTriangle size={32} />);
        setIconBgColor('bg-gray-100');
        setIconColor('text-gray-500');
    }

    // Staggered animations
    const iconTimer = setTimeout(() => setShowIcon(true), 300);
    const titleTimer = setTimeout(() => setShowTitle(true), 600);
    const messageTimer = setTimeout(() => setShowMessage(true), 900);
    const transactionTimer = setTimeout(() => setShowTransaction(true), 1200);
    const buttonsTimer = setTimeout(() => setShowButtons(true), 1500);

    return () => {
      clearTimeout(iconTimer);
      clearTimeout(titleTimer);
      clearTimeout(messageTimer);
      clearTimeout(transactionTimer);
      clearTimeout(buttonsTimer);
    };
  }, [status, errorMessage]);

  // Success animation for the check icon (only for success state)
  const successIconClasses = `
    w-16 h-16 rounded-full flex items-center justify-center mb-6
    ${iconBgColor} ${iconColor}
    ${showIcon ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
    transform transition-all duration-500 ease-out
    ${status === 'success' ? 'animate-bounce' : ''}
  `;

  // Confetti effect for success state
  const SuccessConfetti = () => {
    if (status !== 'success') return null;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute top-0 left-1/2 w-2 h-2 rounded-full
              animate-fall
              bg-${['green', 'blue', 'yellow', 'purple', 'pink'][i % 5]}-${
              ['300', '400', '500'][i % 3]
            }
            `}
            style={{
              left: `${10 + i * 4}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-neutral-50 py-16 min-h-screen relative">
      {status === 'success' && <SuccessConfetti />}

      <div className="container max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
          <div className="p-8">
            <div className="flex flex-col items-center text-center">
              <div className={successIconClasses}>
                {status === 'success' && (
                  <div className="absolute w-24 h-24 rounded-full border-4 border-green-500 opacity-80 animate-ping" />
                )}
                {icon}
              </div>

              <h1
                className={`text-2xl font-bold mb-4 text-neutral-800 transition-all duration-500 ease-out
                ${
                  showTitle
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                {title}
              </h1>

              <p
                className={`text-neutral-600 mb-8 transition-all duration-500 ease-out
                ${
                  showMessage
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                {message}
              </p>

              {status === 'success' && transactionId && (
                <div
                  className={`text-sm bg-neutral-50 p-4 rounded-md text-neutral-500 mb-8 w-full
                  transition-all duration-500 ease-out
                  ${
                    showTransaction
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <p>Transaction ID: {transactionId}</p>
                  <p className="mt-2">
                    A confirmation email has been sent to your registered email
                    address.
                  </p>
                </div>
              )}

              <div
                className={`flex flex-col sm:flex-row gap-4 w-full
                transition-all duration-500 ease-out
                ${
                  showButtons
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                {status === 'success' ? (
                  <Link
                    to="/dashboard"
                    className="bg-green-600 text-white py-3 rounded-md flex-1 text-center hover:bg-green-700 transition-colors"
                  >
                    Go to My Learning
                  </Link>
                ) : (
                  <Link
                    to="/cart"
                    className="bg-blue-600 text-white py-3 rounded-md flex-1 text-center hover:bg-blue-700 transition-colors"
                  >
                    Return to Cart
                  </Link>
                )}

                <Link
                  to="/"
                  className="bg-neutral-100 text-neutral-700 py-3 rounded-md flex-1 text-center hover:bg-neutral-200 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>

              {status === 'error' && (
                <div className="mt-6 text-sm text-neutral-500">
                  Need help?{' '}
                  <a href="/contact" className="text-blue-600 hover:underline">
                    Contact Support
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-fall {
          animation: fall 2s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default CheckoutResult;
