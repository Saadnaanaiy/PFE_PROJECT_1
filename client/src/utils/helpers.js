// Helper functions for the entire application

/**
 * Returns Tailwind CSS classes for styling based on course level
 * @param {string} niveau - The course level
 * @returns {string} - Tailwind CSS classes for the appropriate color styling
 */
export const getLevelColor = (niveau) => {
  switch (niveau?.toLowerCase()) {
    case 'débutant':
      return 'bg-green-100 text-green-800';
    case 'intermédiaire':
      return 'bg-blue-100 text-blue-800';
    case 'avancé':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format a price with currency
 * @param {number} price - The price to format
 * @param {string} currency - The currency code (default: 'MAD')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = 'MAD') => {
  if (price === 0) return 'Free';
  return `${price} ${currency}`;
};
