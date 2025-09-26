// Base API configuration and common functionality
const API_BASE_URL = "https://localhost:7270";

export class BaseApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Centralized error handling
  async handleErrorResponse(response) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }

    // Handle specific HTTP status codes
    switch (response.status) {
      case 401:
        // Unauthorized - clear stored auth and redirect to login
        this.clearAuth();
        throw new Error(errorData.message || 'Session expired. Please login again.');
      
      case 403:
        throw new Error(errorData.message || 'Access denied. You do not have permission for this action.');
      
      case 404:
        throw new Error(errorData.message || 'Resource not found.');
      
      case 429:
        throw new Error(errorData.message || 'Too many requests. Please try again later.');
      
      case 500:
        throw new Error(errorData.message || 'Server error. Please try again later.');
      
      default:
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // You might want to trigger a redirect to login here
    // window.location.href = '/login';
  }

  // Helper methods for common HTTP verbs
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data = null) {
    return this.request(endpoint, {
      method: 'POST',
      ...(data && { body: JSON.stringify(data) })
    });
  }

  async put(endpoint, data = null) {
    return this.request(endpoint, {
      method: 'PUT',
      ...(data && { body: JSON.stringify(data) })
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Build versioned endpoint URLs
  buildEndpoint(controller, action = '', version = '1.0') {
    const base = `/api/v${version}/pub/${controller}`;
    return action ? `${base}/${action}` : base;
  }
}