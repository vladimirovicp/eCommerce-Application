import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

import { ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  CT_PROJECT_KEY,
  CT_CLIENT_ID,
  CT_CLIENT_SECRET,
  CT_SCOPE,
  CT_AUTH_HOST,
  CT_API_HOST,
  CT_CUSTOMER_TOKEN_URL,
  CT_ANONYMOUS_TOKEN_URL,
} from './credentials';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: CT_AUTH_HOST,
  projectKey: CT_PROJECT_KEY,
  credentials: {
    clientId: CT_CLIENT_ID,
    clientSecret: CT_CLIENT_SECRET,
  },
  scopes: CT_SCOPE,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: CT_API_HOST,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(CT_PROJECT_KEY)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: CT_PROJECT_KEY });

export async function fetchAuthToken(username: string, password: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
  });

  const credentials = btoa(`${CT_CLIENT_ID}:${CT_CLIENT_SECRET}`);

  const response = await fetch(CT_CUSTOMER_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: params.toString(),
  });
  const data = await response.json();
  const refreshToken = data.refresh_token;
  localStorage.setItem('refresh_token', refreshToken);
  return refreshToken;
}

export const apiRoots: {
  [key: string]: ByProjectKeyRequestBuilder | null;
} = {
  byRefreshToken: null,
};

// withRefreshTokenFlow
export function createApiRootRefreshTokenFlow(refreshToken: string): void {
  const options: RefreshAuthMiddlewareOptions = {
    host: CT_AUTH_HOST,
    projectKey: CT_PROJECT_KEY,
    credentials: {
      clientId: CT_CLIENT_ID,
      clientSecret: CT_CLIENT_SECRET,
    },
    refreshToken,
  };

  const client = new ClientBuilder()
    .withProjectKey(CT_PROJECT_KEY)
    .withRefreshTokenFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build();

  apiRoots.byRefreshToken = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: CT_PROJECT_KEY });
}

export async function fetchAnonymousToken(): Promise<string> {
  const credentials = btoa(`${CT_CLIENT_ID}:${CT_CLIENT_SECRET}`);
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'manage_project:bikesphere manage_api_clients:bikesphere view_api_clients:bikesphere',
  });

  try {
    const response = await fetch(CT_ANONYMOUS_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await response.json();
    localStorage.setItem('anonymous_token', data.refresh_token);
    createApiRootRefreshTokenFlow(data.refresh_token);
    return data.refresh_token;
  } catch (error) {
    console.error('Error fetching anonymous token:', error);
    return '';
  }
}
