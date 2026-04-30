/**
 * Main barrel export for src/ directory
 * Central export point for the entire application architecture
 */

// NOTE:
// Keep this root barrel intentionally narrow to avoid name collisions
// between domain feature exports, component exports and type exports.
export { default as App } from './app';
export * from './constants';
export * from './hooks';
export * from './utils';
