import { appendHeader, createError, getHeader } from 'h3';

function mapCredentialsToBasicAuthHeaders(multipleCredentials: string): string[] {
  return multipleCredentials.split(';').map((credentials) => `Basic ${btoa(credentials)}`);
}

export default defineEventHandler((event:any) => {
  const config = useRuntimeConfig() || {};
  const basicAuth:string = config?.basicAuth || '' as string;
  const url:string = event.node.req.url

  // If `basicAuth` is empty, do not prompt for authentication
  if (!basicAuth || url.includes('/shopinvader')) {
    return;
  }

  // Format our credentials to their corresponding header:
  // `user:pass` becomes `Basic dXNlcjpwYXNz`
  const validAuthHeaders = mapCredentialsToBasicAuthHeaders(basicAuth);
  const authHeader = getHeader(event, 'authorization');
  // If the given authentication header is valid, do not prompt for authentication
  if (authHeader && validAuthHeaders.some((validAuthHeader) => validAuthHeader === authHeader)) {
    return;
  }

  // Set the `www-authenticate` header to prompt for authentication
  // The realm attribute can be used to customize the message shown to the user
  appendHeader(event, 'www-authenticate', 'Basic realm="Identification"');
  throw createError({ statusCode: 401, statusMessage: 'Not authorized' });
});
