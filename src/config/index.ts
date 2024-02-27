/**
 * The default K2 client connection options.
 *
 *
 */
export interface K2Options {
  /**
   * The client id provided when you create a kopokopo application
   */
  clientId: string;
  /**
   * The client secret which should remain a secret and should not be disclosed to anyone.
   */
  clientSecret: string;
  /**
   * The api key provided when you create a kopokopo application
   */
  apiKey: string;
  /**
   * The application's base url
   */
  baseUrl: string;
}

/**
 * A global interface that exposes the properties of a K2Application
 */
export interface K2Application {
  uid: string;
}
