import { BaseApiService } from "./baseApiService.js";

export class SymbolApiService extends BaseApiService {
  constructor() {
    super();
    this.controller = "admin/symbol";
  }

  /**
   * Get all symbols
   * GET /api/v1.0/pub/admin/symbol
   * @returns {Promise<Array>} Array of symbol objects
   */
  async getAllSymbols() {
    const endpoint = this.buildEndpoint(this.controller);
    return this.get(endpoint);
  }

  /**
   * Get active symbols only
   * GET /api/v1.0/pub/admin/symbol/active
   * @returns {Promise<Array>} Array of active symbol objects
   */
  async getActiveSymbols() {
    const endpoint = this.buildEndpoint(this.controller, "active");
    return this.get(endpoint);
  }

  /**
   * Get a single symbol by ID
   * GET /api/v1.0/pub/admin/symbol/{id}
   * @param {string} id - Symbol ID (GUID)
   * @returns {Promise<Object>} Symbol object
   */
  async getSymbolById(id) {
    const endpoint = this.buildEndpoint(this.controller, id);
    return this.get(endpoint);
  }

  /**
   * Create a new symbol
   * POST /api/v1.0/pub/admin/symbol
   * @param {Object} symbol - Symbol object
   * @param {string} symbol.symbol - Symbol name (e.g., "BTCUSDT")
   * @param {string} symbol.baseAsset - Base asset (e.g., "BTC")
   * @param {string} symbol.quoteAsset - Quote asset (e.g., "USDT")
   * @param {boolean} symbol.isActive - Is symbol active
   * @param {number} symbol.minTradeAmount - Minimum trade amount
   * @param {number} symbol.pricePrecision - Price precision (decimal places)
   * @param {number} symbol.quantityPrecision - Quantity precision (decimal places)
   * @returns {Promise<Object>} Created symbol object
   */
  async createSymbol(symbol) {
    const endpoint = this.buildEndpoint(this.controller);
    console.log("Creating symbol at endpoint:", endpoint, "with data:", symbol);
    return this.post(endpoint, symbol);
  }

  /**
   * Restore a deleted symbol
   * POST /api/v1.0/pub/admin/symbol/{id}/restore
   * @param {string} id - Symbol ID (GUID)
   * @param {Object} symbol - Updated symbol data
   * @returns {Promise<Object>} Restored symbol object
   */
  async restoreSymbol(id, symbol) {
    const endpoint = this.buildEndpoint(this.controller, `${id}/restore`);
    return this.post(endpoint, symbol);
  }

  /**
   * Update an existing symbol
   * PUT /api/v1.0/pub/admin/symbol/{id}
   * @param {string} id - Symbol ID (GUID)
   * @param {Object} symbol - Updated symbol object
   * @returns {Promise<Object>} Updated symbol object
   */
  async updateSymbol(id, symbol) {
    const endpoint = this.buildEndpoint(this.controller, id);
    return this.put(endpoint, symbol);
  }

  /**
   * Delete a symbol (soft delete)
   * DELETE /api/v1.0/pub/admin/symbol/{id}
   * @param {string} id - Symbol ID (GUID)
   * @returns {Promise<void>}
   */
  async deleteSymbol(id) {
    const endpoint = this.buildEndpoint(this.controller, id);
    return this.delete(endpoint);
  }
}

// Export singleton instance
export const symbolApi = new SymbolApiService();

/**
 * EXPECTED API RESPONSE STRUCTURES (for reference)
 *
 * Symbol Object Structure:
 * {
 *   id: "guid-string",
 *   symbol: "BTCUSDT",
 *   baseAsset: "BTC",
 *   quoteAsset: "USDT",
 *   isActive: true,
 *   minTradeAmount: 0.0001,
 *   pricePrecision: 2,
 *   quantityPrecision: 6,
 *   createdAt: "2024-01-15T10:30:00Z",
 *   updatedAt: "2024-01-16T14:20:00Z",
 *   isDeleted: false,
 *   createdBy: "admin@example.com",
 *   updatedBy: "admin@example.com",
 *   exchangeSymbols: []
 * }
 *
 * API Response Wrapper Structure:
 * {
 *   success: true,
 *   message: "Symbols retrieved successfully",
 *   data: [Symbol Object(s)]
 * }
 */
