/**
 * Utility functions for date manipulation and formatting
 */

/**
 * Format date to French format (DD/MM/YYYY)
 * @param date - Date to format
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date('2024-12-10')) // "10/12/2024"
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format date with time (DD/MM/YYYY HH:MM)
 * @param date - Date to format
 * @returns Formatted date string with time
 * 
 * @example
 * formatDateTime(new Date()) // "10/12/2024 14:30"
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}`;
};

/**
 * Format time only (HH:MM)
 * @param date - Date to format
 * @returns Formatted time string
 * 
 * @example
 * formatTime(new Date()) // "14:30"
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Parse French date format to Date object
 * @param dateStr - Date string in DD/MM/YYYY format
 * @returns Date object
 * 
 * @example
 * parseDate('10/12/2024') // Date object
 */
export const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Check if date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export const isInPast = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
};

/**
 * Check if date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Get relative time string (e.g., "Il y a 2 jours")
 * @param date - Date to compare
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    }
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }

  if (diffDays === 1) {
    return 'Hier';
  }

  if (diffDays < 7) {
    return `Il y a ${diffDays} jours`;
  }

  if (diffDays < 30) {
    const diffWeeks = Math.floor(diffDays / 7);
    return `Il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  return `Il y a ${diffMonths} mois`;
};

/**
 * Add days to a date
 * @param date - Starting date
 * @param days - Number of days to add
 * @returns New date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
