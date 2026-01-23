/**
 * API Helper Functions for Match Platform
 * 
 * Utility functions for making API calls
 * Following 100% seamless approach (snake_case everywhere)
 */

import { buildUrl, buildPath } from './api-constants';

/**
 * API Response type
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get standard headers for API requests
 * 
 * @param authToken - Optional JWT token
 * @param contentType - Content type (default: application/json)
 * @returns Headers object
 */
export function getHeaders(
  authToken?: string,
  contentType: string = 'application/json'
): HeadersInit {
  const headers: HeadersInit = {};
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
}

/**
 * Handle API errors uniformly
 * 
 * @param response - Fetch response
 * @throws Error with message from API or default message
 */
export async function handleApiError(response: Response): Promise<never> {
  let errorMessage = 'Une erreur est survenue';
  
  try {
    const error = await response.json();
    errorMessage = error.error || error.message || errorMessage;
  } catch (e) {
    // If parsing fails, use status text
    errorMessage = response.statusText || errorMessage;
  }
  
  throw new Error(errorMessage);
}

/**
 * Parse API response
 * 
 * @param response - Fetch response
 * @returns Parsed JSON data
 * @throws Error if response is not ok
 */
export async function parseResponse<T = any>(response: Response): Promise<T> {
  if (!response.ok) {
    await handleApiError(response);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

/**
 * Generic GET request
 * 
 * @param endpoint - API endpoint
 * @param params - Query parameters (snake_case)
 * @param authToken - Optional JWT token
 * @returns Promise with response data
 */
export async function apiGet<T = any>(
  endpoint: string,
  params?: Record<string, any>,
  authToken?: string
): Promise<T> {
  const url = params ? buildUrl(endpoint, params) : buildPath(endpoint);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(authToken),
  });
  
  return parseResponse<T>(response);
}

/**
 * Generic POST request
 * 
 * @param endpoint - API endpoint
 * @param body - Request body (snake_case)
 * @param authToken - Optional JWT token
 * @returns Promise with response data
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  authToken?: string
): Promise<T> {
  const url = buildPath(endpoint);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(authToken),
    body: body ? JSON.stringify(body) : undefined,
  });
  
  return parseResponse<T>(response);
}

/**
 * Generic PUT request
 * 
 * @param endpoint - API endpoint
 * @param body - Request body (snake_case)
 * @param authToken - Optional JWT token
 * @returns Promise with response data
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  authToken?: string
): Promise<T> {
  const url = buildPath(endpoint);
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: getHeaders(authToken),
    body: body ? JSON.stringify(body) : undefined,
  });
  
  return parseResponse<T>(response);
}

/**
 * Generic PATCH request
 * 
 * @param endpoint - API endpoint
 * @param body - Request body (snake_case)
 * @param authToken - Optional JWT token
 * @returns Promise with response data
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any,
  authToken?: string
): Promise<T> {
  const url = buildPath(endpoint);
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(authToken),
    body: body ? JSON.stringify(body) : undefined,
  });
  
  return parseResponse<T>(response);
}

/**
 * Generic DELETE request
 * 
 * @param endpoint - API endpoint
 * @param authToken - Optional JWT token
 * @returns Promise with response data
 */
export async function apiDelete<T = any>(
  endpoint: string,
  authToken?: string
): Promise<T> {
  const url = buildPath(endpoint);
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getHeaders(authToken),
  });
  
  return parseResponse<T>(response);
}

/**
 * Upload file (multipart/form-data)
 * 
 * @param endpoint - API endpoint
 * @param formData - FormData object
 * @param authToken - Optional JWT token
 * @returns Promise with response data
 */
export async function apiUpload<T = any>(
  endpoint: string,
  formData: FormData,
  authToken?: string
): Promise<T> {
  const url = buildPath(endpoint);
  
  const headers: HeadersInit = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  // Don't set Content-Type for FormData - browser will set it with boundary
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  return parseResponse<T>(response);
}

/**
 * Download file (returns blob)
 * 
 * @param endpoint - API endpoint
 * @param authToken - Optional JWT token
 * @returns Promise with blob
 */
export async function apiDownload(
  endpoint: string,
  authToken?: string
): Promise<Blob> {
  const url = buildPath(endpoint);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(authToken, ''),
  });
  
  if (!response.ok) {
    await handleApiError(response);
  }
  
  return response.blob();
}

/**
 * Check if response is successful (2xx status)
 * 
 * @param response - Fetch response
 * @returns boolean
 */
export function isSuccess(response: Response): boolean {
  return response.ok && response.status >= 200 && response.status < 300;
}

/**
 * Retry a failed request
 * 
 * @param fn - Function that returns a Promise
 * @param retries - Number of retries (default: 3)
 * @param delay - Delay between retries in ms (default: 1000)
 * @returns Promise
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay);
  }
}

/**
 * Cache API responses in memory
 */
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * Get cached response or fetch new one
 * 
 * @param key - Cache key
 * @param fn - Function that returns a Promise
 * @param ttl - Time to live in ms (default: 5 minutes)
 * @returns Promise with cached or fresh data
 */
export async function getCached<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const data = await fn();
  cache.set(key, { data, timestamp: Date.now() });
  
  return data;
}

/**
 * Clear cache
 * 
 * @param key - Optional key to clear specific entry
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Build query string from params
 * 
 * @param params - Query parameters
 * @returns Query string (without leading ?)
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

/**
 * Parse error message from API response
 * 
 * @param error - Error object
 * @returns User-friendly error message
 */
export function parseErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error) {
    return error.error;
  }
  
  return 'Une erreur est survenue';
}
