import { ClientBuilder, AuthMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';

import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
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
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: CT_PROJECT_KEY });

export default apiRoot;
