import { BaseApiService } from "./baseApiService.js";

export class AuthenticationApiService extends BaseApiService {
  constructor() {
    super();
    this.controller = "authentication";
  }

  async authenticate(credentials) {
    const endpoint = this.buildEndpoint(this.controller, "authenticate");
    return this.post(endpoint, credentials);
  }

  async revoke() {
    const endpoint = this.buildEndpoint(this.controller, "revoke");
    return this.post(endpoint);
  }

  async forgotPassword(email) {
    const endpoint = this.buildEndpoint(this.controller, "forgot-password");
    return this.post(endpoint, { email });
  }

  async resetPassword(token, newPassword) {
    const endpoint = this.buildEndpoint(this.controller, "reset-password");
    return this.post(endpoint, {
      refreshToken: token,
      newPassword: newPassword,
    });
  }

  async refreshToken(refreshToken) {
    const endpoint = this.buildEndpoint(this.controller, "refresh");
    return this.post(endpoint, { refreshToken });
  }

  async getCurrentUser() {
    const endpoint = this.buildEndpoint(this.controller, "me");
    return this.get(endpoint);
  }

  async validateToken() {
    const endpoint = this.buildEndpoint(this.controller, "validate");
    return this.post(endpoint);
  }

  async generateToken(tokenRequest) {
    const endpoint = this.buildEndpoint(this.controller, "token");
    return this.post(endpoint, tokenRequest);
  }

  storeAuthData(authResponse) {
    if (authResponse.data && authResponse.data.token) {
      localStorage.setItem("authToken", authResponse.data.token);
      localStorage.setItem("authUser", JSON.stringify(authResponse.data.user));
    }
  }

  getAuthData() {
    try {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("authUser");
      if (token && user) {
        return {
          token: token,
          user: JSON.parse(user),
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("authUser");
    return !!(token && user);
  }

  getStoredUser() {
    try {
      const userData = localStorage.getItem("authUser");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  isAdmin() {
    const user = this.getStoredUser();
    return user?.isSystemAdmin || false;
  }

  logout() {
    // Call revoke asynchronously (fire and forget)
    this.revoke().catch((error) => {
      console.warn("Revoke failed during logout:", error);
    });

    // Clear local storage immediately
    this.clearAuth();
  }
}

export const authenticationApi = new AuthenticationApiService();
