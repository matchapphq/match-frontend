/**
 * Utility functions for formatting data
 */

/**
 * Format price with currency symbol
 * @param price - Price to format
 * @param currency - Currency code (default: EUR)
 * @returns Formatted price string
 * 
 * @example
 * formatPrice(30) // "30,00 €"
 * formatPrice(300, 'USD') // "$300.00"
 */
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Format percentage
 * @param value - Value to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(0.73) // "73%"
 * formatPercentage(73, 1) // "73.0%"
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  const percentage = value <= 1 ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format large numbers with K/M suffix
 * @param num - Number to format
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1453) // "1.5K"
 * formatNumber(12400) // "12.4K"
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format phone number (French format)
 * @param phone - Phone number string
 * @returns Formatted phone number
 * 
 * @example
 * formatPhone('0123456789') // "01 23 45 67 89"
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }
  
  return phone;
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 * @returns Truncated text
 * 
 * @example
 * truncateText('Long text here...', 10) // "Long text..."
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};
