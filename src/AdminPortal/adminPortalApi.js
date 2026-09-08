// `apiBaseUrl` is the full base path the backend's admin-portal router was mounted at
export const createAdminPortalApi = ({ apiBaseUrl, getAccessToken }) => {
  const request = async (path, options = {}) => {
    const accessToken = await getAccessToken();

    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
  };
};
