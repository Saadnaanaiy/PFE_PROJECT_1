import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * PaymentRedirect component
 *
 * This component acts as a bridge between backend payment routes and frontend checkout result page.
 * It receives payment status parameters from Stripe/backend and redirects to the checkout result page.
 */
const PaymentRedirect = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get URL search parameters
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const error = searchParams.get('error');

    // Determine status based on URL and parameters
    let redirectParams = new URLSearchParams();

    if (location.pathname.includes('/payment/success') && sessionId) {
      redirectParams.set('status', 'success');
      // The transaction_id should come from your backend via the URL
      // This is just a fallback in case it's not provided
      redirectParams.set(
        'transaction_id',
        searchParams.get('transaction_id') || '1',
      );
    } else if (location.pathname.includes('/payment/cancel')) {
      redirectParams.set('status', 'cancelled');
    } else {
      redirectParams.set('status', 'error');
      if (error) {
        redirectParams.set('message', error);
      }
    }

    // Redirect to checkout result page using React Router navigation
    navigate(`/checkout/result?${redirectParams.toString()}`);
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-neutral-600">Processing your payment...</p>
      </div>
    </div>
  );
};

export default PaymentRedirect;
