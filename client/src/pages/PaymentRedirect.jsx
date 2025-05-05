import { useState, useEffect } from 'react';

/**
 * PaymentRedirect component
 *
 * This component acts as a bridge between backend payment routes and frontend checkout result page.
 * It receives payment status parameters from Stripe/backend and redirects to the checkout result page.
 */
const PaymentRedirect = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get URL search parameters
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get('session_id');
    const error = searchParams.get('error');

    // Determine status based on URL and parameters
    let redirectParams = new URLSearchParams();

    if (window.location.pathname.includes('/payment/success') && sessionId) {
      redirectParams.set('status', 'success');
      redirectParams.set('transaction_id', '1'); // In a real app, this would come from your backend
    } else if (window.location.pathname.includes('/payment/cancel')) {
      redirectParams.set('status', 'cancelled');
    } else {
      redirectParams.set('status', 'error');
      if (error) {
        redirectParams.set('message', error);
      }
    }

    // Redirect to checkout result page
    window.location.href = `/checkout/result?${redirectParams.toString()}`;
  }, []);

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
