const EXPIRY_BUFFER_SECONDS = 60;
const GET_CACHE_TTL_MS = 10_000;

export const createManagementApiClient = ({ domain, clientId, clientSecret, audience }) => {
  const managementApiBase = `https://${domain}/api/v2`;
  const tokenAudience = audience || `https://${domain}/api/v2/`;

  let cachedToken = null;
  let cachedExpiresAt = 0;
  let pendingTokenRequest = null;

  const requestNewToken = async () => {
    const response = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: tokenAudience,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to obtain Management API token: ${response.status}`);
    }

    const data = await response.json();

    cachedToken = data.access_token;
    cachedExpiresAt = Date.now() + (data.expires_in - EXPIRY_BUFFER_SECONDS) * 1000;

    return cachedToken;
  };

  const getToken = () => {
    if (cachedToken && Date.now() < cachedExpiresAt) {
      return Promise.resolve(cachedToken);
    }

    if (!pendingTokenRequest) {
      pendingTokenRequest = requestNewToken().finally(() => {
        pendingTokenRequest = null;
      });
    }

    return pendingTokenRequest;
  };

  const request = async (path, options = {}) => {
    const accessToken = await getToken();

    const response = await fetch(`${managementApiBase}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Auth0 Management API request to ${path} failed: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  const getCache = new Map();

  const get = (path) => {
    const cached = getCache.get(path);
    if (cached && Date.now() - cached.timestamp < GET_CACHE_TTL_MS) {
      return cached.promise;
    }

    const promise = request(path).catch((error) => {
      getCache.delete(path);
      throw error;
    });

    getCache.set(path, { promise, timestamp: Date.now() });
    return promise;
  };

  const write = async (path, options) => {
    const result = await request(path, options);
    getCache.clear();
    return result;
  };

  return { get, write };
};
