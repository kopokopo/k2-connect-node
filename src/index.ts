// The start of something new
import { K2Options } from "./config";
import { K2Token, K2TokenService } from "./tokens";

/**
 * This is the entry point for the k2-connect-node module
 * The options object is passed to other classes that needs authentication
 * @exports K2
 * @constructor
 * @param {K2Options} options - Default configuration options
 * @param {string} options.clientId - The client id of the merchant.
 * @param {string} options.clientSecret - The client secret of the merchant.
 * @param {string} options.apiKey - The api key of the merchant.
 * @param {string} options.baseUrl - The url to send requests to.
 */
export class K2 {
  private options: K2Options;
  constructor(options: K2Options) {
    this.options = options;
  }

  /**
   * Handles oauth2 operations
   * @returns `K2TokenService` which exposes various methods for working with the auth
   * tokens.
   * The `K2TokenService` exposes methods necessary for the access and manipulation of
   * auth tokens.
   */
  public auth(): K2TokenService {
    return new K2Token(this.options);
  }
}
