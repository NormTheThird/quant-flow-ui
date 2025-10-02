// Base API configuration and common functionality
const API_BASE_URL = "https://localhost:7270";

export class BaseApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Process queued requests after token refresh
  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Refresh the access token
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${this.baseURL}/api/v1.0/pub/authentication/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      if (data.success && data.data) {
        localStorage.setItem("authToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        return data.data.accessToken;
      }

      throw new Error("Invalid refresh response");
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  // Generic request method with automatic token refresh
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 - try to refresh token
      if (response.status === 401) {
        if (this.isRefreshing) {
          // Wait for the ongoing refresh
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            return fetch(url, config).then(this.handleResponse.bind(this));
          });
        }

        this.isRefreshing = true;

        try {
          const newToken = await this.refreshAccessToken();
          this.isRefreshing = false;
          this.processQueue(null, newToken);

          // Retry original request with new token
          config.headers.Authorization = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, config);
          return this.handleResponse(retryResponse);
        } catch (refreshError) {
          this.isRefreshing = false;
          this.processQueue(refreshError, null);
          this.clearAuth();
          throw new Error("Session expired. Please login again.");
        }
      }

      return this.handleResponse(response);
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Handle response parsing
  async handleResponse(response) {
    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return response;
  }

  // Centralized error handling
  async handleErrorResponse(response) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }

    // Extract the message from the ApiResponse structure
    const errorMessage = errorData.message || errorData.Message;

    // Create error with additional data property
    const error = new Error(errorMessage || `HTTP error! status: ${response.status}`);
    error.responseData = errorData.data; // Preserve the data from API response
    error.statusCode = response.status;

    throw error;
  }

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
    // Redirect to login if needed
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  // Helper methods for common HTTP verbs
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint, data = null) {
    return this.request(endpoint, {
      method: "POST",
      ...(data && { body: JSON.stringify(data) }),
    });
  }

  async put(endpoint, data = null) {
    return this.request(endpoint, {
      method: "PUT",
      ...(data && { body: JSON.stringify(data) }),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // Build versioned endpoint URLs
  buildEndpoint(controller, action = "", version = "1.0") {
    const base = `/api/v${version}/pub/${controller}`;
    return action ? `${base}/${action}` : base;
  }
}
