// The start of something new
//
interface K2Options {
  clientId: string;
  clientSecret: string;
  apiKey: string;
  baseUrl: string;
}

interface K2AuthToken {
  token: string;
}

interface K2SmsNotificationService {
  sendTransactionSmsNotification(): Promise<any>;
}

/**
 * Provides various methods for interacting with oauth tokens
 * ### Sample Methods Exposed.
 * `getToken()` - Get the current token
 *
 * `revokeToken()` - Revokes an access token
 *
 * `introspect()` - Introspects a given token
 *
 * `tokenInfo()` - Provides more details about the given token
 */
interface K2TokenService {
  /**
   * @param token - an optional access token value
   * @returns `K2AuthToken` - which contains the access token
   */
  getToken(token?: string): K2AuthToken;
  revokeToken(): K2AuthToken;
  introspectToken(): K2AuthToken;
  tokenInfo(): K2AuthToken;
}

/**
 * This is the entry point for the k2-connect-node module
 * The options object is passed to other classes that needs authentication
 * @exports K2
 * @constructor
 * @param {object} options
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
    return {
      getToken: () => {
        // gets the token details from wherever
        return { token: "" };
      },
      revokeToken() {
        return { token: "" };
      },
      introspectToken() {
        return { token: "" };
      },
      tokenInfo() {
        return { token: "" };
      },
    };
  }

  public SmsNotificationService(): K2SmsNotificationService {
    return {} as K2SmsNotificationService;
  }
}

const k2Client = new K2({
  clientId: "",
  clientSecret: "",
  apiKey: "",
  baseUrl: "",
});

const notifications = k2Client
  .SmsNotificationService()
  .sendTransactionSmsNotification();

// Auth Operations are as easy as
const tokenInfo = k2Client.auth().tokenInfo();
const revokeToken = k2Client.auth().revokeToken();
const token = k2Client.auth().getToken();
