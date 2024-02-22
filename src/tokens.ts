import { K2Options } from "index";

export interface K2AuthToken {
  token: string;
}

export interface K2TokenDescription {
  tokenType: string;
  expiresIn: string;
  accessToken: string;
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
   * @returns `K2TokenDescription` - which contains the access token, token type and expiry details
   */
  getToken(): Promise<K2TokenDescription | undefined>;

  /**
   * Handles requests for revoking an access token
   * @function revokeToken
   * @memberof TokenService
   * @param {object} opts
   * @param {string} opts.accessToken - The access token to be revoked.
   * @returns {Promise} Promise object returning empty body
   */
  revokeToken(): K2AuthToken;

  /**
   * Handles requests for introspecting an access token
   * @function introspectToken
   * @memberof TokenService
   * @param {object} opts
   * @param {string} opts.accessToken - The access token to be revoked.
   * @returns {Promise} Promise object having the token_type, client_id, scope, active, exp(expiry time), iat(created time)
   */
  introspectToken(): K2AuthToken;

  /**
   * Handles requests for getting information on the token
   * @function infoToken
   * @memberof TokenService
   * @param {object} opts
   * @param {string} opts.accessToken - The access token to be revoked.
   * @returns {Promise} Promise object having the scope, expires_in, application.uid, created_at
   */
  tokenInfo(): K2AuthToken;
}

export class K2Token implements K2TokenService {
  constructor(private options: K2Options) {}

  async getToken(): Promise<K2TokenDescription | undefined> {
    var requestBody = {
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      grant_type: "client_credentials",
    };

    try {
      const res = await fetch(this.options.baseUrl + "/oauth/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(requestBody),
      });

      if (res.status === 200) {
        return await res.json();
      } else {
        console.log("Something not right is happening.");
        throw new Error(res.statusText);
      }
    } catch (e: any) {
      console.log("An error occured", e.message);
      return;
    }
  }

  revokeToken(): K2AuthToken {
    throw new Error("Method not implemented.");
  }
  introspectToken(): K2AuthToken {
    throw new Error("Method not implemented.");
  }
  tokenInfo(): K2AuthToken {
    throw new Error("Method not implemented.");
  }
}
