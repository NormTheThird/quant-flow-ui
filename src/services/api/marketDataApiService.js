import { BaseApiService } from "./baseApiService.js";

export class MarketDataConfigApiService extends BaseApiService {
  constructor() {
    super();
    this.controller = "admin/marketdataconfiguration";
    this.symbolsController = "symbols";
  }

  /**
   * Get all market data configurations
   * GET /api/v1.0/pub/admin/marketdataconfiguration
   * @returns {Promise<Array>} Array of configuration objects
   */
  async getAllConfigurations() {
    const endpoint = this.buildEndpoint(this.controller);
    return this.get(endpoint);
  }

  /**
   * Get all available symbols from the Symbols table
   * GET /api/v1.0/pub/symbols
   * @returns {Promise<Array>} Array of symbol objects with id and symbol name
   */
  async getAllSymbols() {
    const endpoint = this.buildEndpoint(this.symbolsController);
    return this.get(endpoint);
  }

  /**
   * Create a new market data configuration
   * POST /api/v1.0/pub/admin/marketdataconfiguration
   * @param {Object} config - Configuration object
   * @param {string} config.symbolId - GUID of the symbol
   * @param {string} config.exchange - Exchange name (Kraken, Kucoin, etc.)
   * @param {boolean} config.is1mActive - Enable 1 minute interval
   * @param {boolean} config.is5mActive - Enable 5 minute interval
   * @param {boolean} config.is15mActive - Enable 15 minute interval
   * @param {boolean} config.is1hActive - Enable 1 hour interval
   * @param {boolean} config.is4hActive - Enable 4 hour interval
   * @param {boolean} config.is1dActive - Enable 1 day interval
   * @returns {Promise<Object>} Created configuration object
   */
  async createConfiguration(config) {
    const endpoint = this.buildEndpoint(this.controller);
    return this.post(endpoint, config);
  }

  /**
   * Toggle a specific interval on or off for a configuration
   * PUT /api/v1.0/pub/admin/marketdataconfiguration/{id}/interval/{interval}
   * @param {string} id - Configuration ID (GUID)
   * @param {string} interval - Interval name ('1m', '5m', '15m', '1h', '4h', '1d')
   * @param {boolean} isActive - New active state
   * @returns {Promise<Object>} Updated configuration object
   */
  async toggleInterval(id, interval, isActive) {
    const endpoint = this.buildEndpoint(this.controller, `${id}/interval/${interval}`);
    return this.put(endpoint, { isActive });
  }

  /**
   * Delete multiple market data configurations (soft delete)
   * DELETE /api/v1.0/pub/admin/marketdataconfiguration
   * @param {Array<string>} ids - Array of configuration IDs (GUIDs)
   * @returns {Promise<void>}
   */
  async deleteConfigurations(ids) {
    const endpoint = this.buildEndpoint(this.controller);
    return this.delete(endpoint, { ids });
  }

  /**
   * Get a single configuration by ID
   * GET /api/v1.0/pub/admin/marketdataconfiguration/{id}
   * @param {string} id - Configuration ID (GUID)
   * @returns {Promise<Object>} Configuration object
   */
  async getConfigurationById(id) {
    const endpoint = this.buildEndpoint(this.controller, id);
    return this.get(endpoint);
  }

  /**
   * Update an entire configuration
   * PUT /api/v1.0/pub/admin/marketdataconfiguration/{id}
   * @param {string} id - Configuration ID (GUID)
   * @param {Object} config - Updated configuration object
   * @returns {Promise<Object>} Updated configuration object
   */
  async updateConfiguration(id, config) {
    const endpoint = this.buildEndpoint(this.controller, id);
    return this.put(endpoint, config);
  }
}

// Export singleton instance
export const marketDataConfigApi = new MarketDataConfigApiService();

/**
 * EXPECTED API RESPONSE STRUCTURES (for reference)
 *
 * Configuration Object Structure:
 * {
 *   id: "guid-string",
 *   symbolId: "guid-string",
 *   symbolName: "BTCUSDT",  // Joined from Symbols table
 *   exchange: "Kraken",  // Exchange name as string
 *   is1mActive: true,
 *   is5mActive: true,
 *   is15mActive: false,
 *   is1hActive: true,
 *   is4hActive: false,
 *   is1dActive: true,
 *   createdAt: "2024-01-15T10:30:00Z",
 *   updatedAt: "2024-01-16T14:20:00Z",
 *   createdBy: "admin@example.com",
 *   updatedBy: "admin@example.com"
 * }
 *
 * Symbol Object Structure:
 * {
 *   id: "guid-string",
 *   symbol: "BTCUSDT",
 *   baseAsset: "BTC",
 *   quoteAsset: "USDT",
 *   isActive: true
 * }
 */
