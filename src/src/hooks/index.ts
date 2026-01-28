/**
 * Global hooks exports
 * Export all custom hooks from this file
 */

// Utility hooks
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useClickOutside } from './useClickOutside';
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from './useMediaQuery';

// API hooks (re-exported from root)
export * from './api';