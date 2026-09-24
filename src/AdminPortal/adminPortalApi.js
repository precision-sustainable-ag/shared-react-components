export const createAdminPortalApi = ({ apiBaseUrl, getAccessToken, appName }) => {
  const request = async (path, options = {}) => {
    const accessToken = await getAccessToken();

    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-App-Name': appName,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Admin portal request to ${path} failed: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  };

  return {
    fetchConfig: () => request('/config'),
    fetchUsers: () => request('/admin/users'),
    fetchRoles: () => request('/roles'),
    assignRole: (userId, roleIdOrIds) =>
      request(`/admin/users/${encodeURIComponent(userId)}/role`, {
        method: 'POST',
        body: JSON.stringify(
          Array.isArray(roleIdOrIds) ? { roleIds: roleIdOrIds } : { roleId: roleIdOrIds },
        ),
      }),
    rejectAccessRequest: (userId) =>
      request(`/admin/users/${encodeURIComponent(userId)}/reject-request`, {
        method: 'POST',
      }),
    deleteUser: (userId) =>
      request(`/admin/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      }),
  };
};
