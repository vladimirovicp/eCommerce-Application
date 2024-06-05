import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';

import { ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { CT_PROJECT_KEY, CT_CLIENT_ID, CT_CLIENT_SECRET, CT_SCOPE, CT_AUTH_HOST, CT_API_HOST } from './credentials';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: CT_AUTH_HOST,
  projectKey: CT_PROJECT_KEY,
  credentials: {
    clientId: CT_CLIENT_ID,
    clientSecret: CT_CLIENT_SECRET,
  },
  scopes: CT_SCOPE,
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: CT_API_HOST,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(CT_PROJECT_KEY)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  // .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: CT_PROJECT_KEY });
// export let apiTokenRoot: ByProjectKeyRequestBuilder;

export function createApiRootPasswordFlow(username: string, password: string): ByProjectKeyRequestBuilder {
  const passwordFlowOptions: PasswordAuthMiddlewareOptions = {
    host: CT_AUTH_HOST,
    projectKey: CT_PROJECT_KEY,
    credentials: { clientId: CT_CLIENT_ID, clientSecret: CT_CLIENT_SECRET, user: { username, password } },
    scopes: CT_SCOPE,
    fetch,
  };

  const client = new ClientBuilder()
    .withProjectKey(CT_PROJECT_KEY)
    .withPasswordFlow(passwordFlowOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: CT_PROJECT_KEY });
}

export async function fetchAuthToken(username: string, password: string): Promise<string> {
  const url = `https://auth.europe-west1.gcp.commercetools.com/oauth/${CT_PROJECT_KEY}/customers/token`;

  const params = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
  });

  const credentials = btoa(`${CT_CLIENT_ID}:${CT_CLIENT_SECRET}`);

  const response = await fetch(url, {
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
  // createApiRootRefreshTokenFlow(refreshToken);
  console.log(refreshToken);
  return refreshToken;
}

// withRefreshTokenFlow

export function createApiRootRefreshTokenFlow(refreshToken: string): ByProjectKeyRequestBuilder {
  const options: RefreshAuthMiddlewareOptions = {
    host: CT_AUTH_HOST,
    projectKey: CT_PROJECT_KEY,
    credentials: {
      clientId: CT_CLIENT_ID,
      clientSecret: CT_CLIENT_SECRET,
    },
    refreshToken,
    // tokenCache: TokenCache,
  };

  const client = new ClientBuilder()
    .withProjectKey(CT_PROJECT_KEY)
    .withRefreshTokenFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: CT_PROJECT_KEY });
}

export { apiRoot };
