/**
 * API Helper Functions for Match Platform
 * 
 * Utility functions for making API calls
 * Refactored to use Axios for better interceptor support and standardization
 */

import apiClient from '../api/client';
import { AxiosRequestConfig } from 'axios';
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
 * Kept for backward compatibility
 * 
 * @param authToken - Optional JWT token
 * @param contentType - Content type (default: application/json)
 * @returns Headers object
 */
export function getHeaders(
  authToken?: string,
  contentType: string = 'application/json'
): any {
  const headers: any = {};
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
}

/**
 * Generic GET request
 * 
 * @param endpoint - API endpoint
 * @param params - Query parameters (snake_case)
 * @param authToken - Optional JWT token (overrides default)
 * @returns Promise with response data
 */
export async function apiGet<T = any>(
  endpoint: string,
  params?: Record<string, any>,
  authToken?: string
): Promise<T> {
  const config: AxiosRequestConfig = {
    params,
  };

  if (authToken) {
    config.headers = { Authorization: `Bearer ${authToken}` };
  }

  const response = await apiClient.get<T>(endpoint, config);
  return response.data;
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
  const config: AxiosRequestConfig = {};

  if (authToken) {
    config.headers = { Authorization: `Bearer ${authToken}` };
  }

  const response = await apiClient.post<T>(endpoint, body, config);
  return response.data;
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
  const config: AxiosRequestConfig = {};

  if (authToken) {
    config.headers = { Authorization: `Bearer ${authToken}` };
  }

  const response = await apiClient.put<T>(endpoint, body, config);
  return response.data;
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
  const config: AxiosRequestConfig = {};

  if (authToken) {
    config.headers = { Authorization: `Bearer ${authToken}` };
  }

  const response = await apiClient.patch<T>(endpoint, body, config);
  return response.data;
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
  const config: AxiosRequestConfig = {};

  if (authToken) {
    config.headers = { Authorization: `Bearer ${authToken}` };
  }

  const response = await apiClient.delete<T>(endpoint, config);
  return response.data;
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
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (authToken) {
    config.headers = { 
      ...config.headers, 
      Authorization: `Bearer ${authToken}` 
    };
  }

  const response = await apiClient.post<T>(endpoint, formData, config);
  return response.data;
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
  const config: AxiosRequestConfig = {
    responseType: 'blob',
  };

  if (authToken) {
    config.headers = { Authorization: `Bearer ${authToken}` };
  }

  const response = await apiClient.get<Blob>(endpoint, config);
  return response.data;
}

/**
 * Check if response is successful (2xx status)
 * 
 * @param response - Response object (AxiosResponse or plain object)
 * @returns boolean
 */
export function isSuccess(response: any): boolean {
  if (response && response.status) {
    return response.status >= 200 && response.status < 300;
  }
  return true; // If we got data back from axios, it was likely successful (interceptors catch errors)
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