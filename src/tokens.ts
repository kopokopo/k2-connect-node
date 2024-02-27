import { K2Application, K2Options } from "./config";
import { sendRequest } from "./helpers/dispatch";

export interface K2AuthToken {
  token: string;
}

export interface K2TokenDescription {
  tokenType: string;
  expiresIn: string;
  accessToken: string;
}

export interface K2TokenInfo {
  scope: string;
  expires_in: string;
  application: K2Application;
  created_at: string;
}

/**
 * Provides various methods for interacting with oauth tokens
 * ### Exposess the following methods
 * `getToken()` - Get the current token
 *
 * `revokeToken()` - Revokes an access token
 *
 * `introspect()` - Introspects a given token
 *
 * `tokenInfo()` - Provides more details about the given token
 */
export interface K2TokenService {
  /**
   * @returns `K2TokenDescription` which contains the access token, token type and expiry details
   */
  getToken(): Promise<K2TokenDescription | undefined>;

  /**
   * Handles requests for revoking an access token
   * @param {string} token - The access token to be revoked.
   * @returns {Promise} Promise object returning empty body
   */
  revokeToken(token: string): Promise<K2AuthToken>;

  /**
   * Handles requests for introspecting an access token
   * @param {string} token - The access token to be revoked.
   * @returns {Promise} Promise object having the token_type, client_id, scope, active, exp(expiry time), iat(created time)
   */
  introspectToken(token: string): Promise<K2AuthToken>;

  /**
   * Handles requests for getting information on the token
   * @param {string} token - The access token to be revoked.
   * @returns {Promise} `K2TokenInfo` Promise object having the scope, expires_in, application.uid, created_at
   */
  tokenInfo(token: string): Promise<K2TokenInfo>;
}

export class K2Token implements K2TokenService {
  constructor(private options: K2Options) {}

  async getToken(): Promise<K2TokenDescription> {
    var requestBody = {
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      grant_type: "client_credentials",
    };

    try {
      const response = await sendRequest<K2TokenDescription>(
        this.options.baseUrl + "/oauth/token",
        {
          body: JSON.stringify(requestBody),
        },
      );

      return response;
    } catch (e: any) {
      throw e;
    }
  }

  async revokeToken(token: string): Promise<K2AuthToken> {
    var requestBody = {
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      token,
    };

    // dispatch the request to revoke the given access token
    try {
      const response = await sendRequest<K2AuthToken>(
        this.options.baseUrl + "/oauth/revoke",
        {
          body: JSON.stringify(requestBody),
        },
      );
      return response;
    } catch (e) {
      throw e;
    }
  }

  async introspectToken(token: string): Promise<K2AuthToken> {
    var requestBody = {
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      token,
    };
    try {
      const response = await sendRequest<K2AuthToken>(
        this.options.baseUrl + "/oauth/introspect",
        {
          body: JSON.stringify(requestBody),
        },
      );

      return response;
    } catch (e) {
      throw e;
    }
  }

  async tokenInfo(token: string): Promise<K2TokenInfo> {
    try {
      const tokenInfo = await sendRequest<K2TokenInfo>(
        this.options.baseUrl + "/oauth/token/info",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );
      return tokenInfo;
    } catch (e) {
      throw e;
    }
  }
}
