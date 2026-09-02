export const createAuth0UserService = (
  managementApiClient,
  { adminRoleName = 'Admin', defaultRoleName = null, roleAssignmentMode = 'single' } = {},
) => {
  const { get, write } = managementApiClient;

  const fetchAllRoles = () => get('/roles');
  const fetchAllUsers = () => get('/users?per_page=100&include_totals=false');
  const fetchUser = (userId) => get(`/users/${encodeURIComponent(userId)}`);
  const fetchUserRoles = (userId) => get(`/users/${encodeURIComponent(userId)}/roles`);
  const fetchRoleUsers = (roleId) => get(`/roles/${encodeURIComponent(roleId)}/users`);

  const removeUserRoles = (userId, roleIds) =>
    write(`/users/${encodeURIComponent(userId)}/roles`, {
      method: 'DELETE',
      body: JSON.stringify({ roles: roleIds }),
    });

  const addUserRoles = (userId, roleIds) =>
    write(`/users/${encodeURIComponent(userId)}/roles`, {
      method: 'POST',
      body: JSON.stringify({ roles: roleIds }),
    });

  const updateUserMetadata = (userId, userMetadata) =>
    write(`/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ user_metadata: userMetadata }),
    });

  const setUserRoles = async (userId, roleIds) => {
    const currentRoles = await fetchUserRoles(userId);
    const currentRoleIds = currentRoles.map((role) => role.id);

    if (roleAssignmentMode === 'single') {
      const [singleRoleId] = roleIds;

      if (currentRoleIds.length > 0) {
        await removeUserRoles(userId, currentRoleIds);
      }
      if (singleRoleId) {
        await addUserRoles(userId, [singleRoleId]);
      }
      return;
    }

    const toRemove = currentRoleIds.filter((id) => !roleIds.includes(id));
    const toAdd = roleIds.filter((id) => !currentRoleIds.includes(id));

    if (toRemove.length > 0) {
      await removeUserRoles(userId, toRemove);
    }
    if (toAdd.length > 0) {
      await addUserRoles(userId, toAdd);
    }
  };

  const isAdmin = async (userId) => {
    const roles = await fetchUserRoles(userId);
    return roles.some((role) => role.name === adminRoleName);
  };

  // Brand-new signups have no role yet — hand them the default one the
  // first time they're seen, rather than requiring a separate onboarding step.
  const getCurrentUserRoles = async (userId) => {
    let roles = await fetchUserRoles(userId);

    if (roles.length === 0 && defaultRoleName) {
      const allRoles = await fetchAllRoles();
      const defaultRole = allRoles.find((role) => role.name === defaultRoleName);

      if (defaultRole) {
        await setUserRoles(userId, [defaultRole.id]);
        roles = [defaultRole];
      } else {
        console.warn(`Default role "${defaultRoleName}" not found in Auth0 roles`);
      }
    }

    return roles;
  };

  const getAccessRequest = async (userId) => {
    const user = await fetchUser(userId);
    return {
      requestedAccess: user.user_metadata?.requestedAccess ?? null,
      requestStatus: user.user_metadata?.requestStatus ?? null,
    };
  };

  const submitAccessRequest = (userId, requestedAccess) =>
    updateUserMetadata(userId, { requestedAccess, requestStatus: 'PENDING' });

  const listUsersWithRoles = async () => {
    const [users, roles] = await Promise.all([fetchAllUsers(), fetchAllRoles()]);
    const roleUserLists = await Promise.all(roles.map((role) => fetchRoleUsers(role.id)));

    const rolesByUserId = new Map();
    roles.forEach((role, index) => {
      roleUserLists[index].forEach((roleUser) => {
        const existing = rolesByUserId.get(roleUser.user_id) ?? [];
        rolesByUserId.set(roleUser.user_id, [...existing, role]);
      });
    });

    return users.map((appUser) => {
      const userRoles = rolesByUserId.get(appUser.user_id) ?? [];

      return {
        id: appUser.user_id,
        name: appUser.name || appUser.nickname || '—',
        email: appUser.email || '—',
        roles: userRoles,
        role: userRoles[0] ?? null,
        requestedAccess: appUser.user_metadata?.requestedAccess ?? null,
        requestStatus: appUser.user_metadata?.requestStatus ?? null,
      };
    });
  };

  // Only clears the pending request if one of the newly assigned roles is
  // the one that was actually requested — assigning a different role should
  // leave the original request visible for follow-up.
  const assignRoleToUser = async (userId, roleIdOrIds) => {
    const roleIds = Array.isArray(roleIdOrIds) ? roleIdOrIds : [roleIdOrIds];
    const [allRoles, targetUser] = await Promise.all([fetchAllRoles(), fetchUser(userId)]);
    const assignedRoles = allRoles.filter((role) => roleIds.includes(role.id));

    await setUserRoles(userId, roleIds);

    const requestedAccess = targetUser.user_metadata?.requestedAccess ?? null;
    const requestStatus = targetUser.user_metadata?.requestStatus ?? null;
    const requestFulfilled =
      requestStatus === 'PENDING' && assignedRoles.some((role) => role.name === requestedAccess);

    if (requestFulfilled) {
      await updateUserMetadata(userId, { requestedAccess: null, requestStatus: null });
    }

    return {
      user: targetUser,
      assignedRoles,
      requestedAccess: requestFulfilled ? null : requestedAccess,
      requestStatus: requestFulfilled ? null : requestStatus,
    };
  };

  const rejectAccessRequest = async (userId) => {
    const targetUser = await fetchUser(userId);
    const requestedAccess = targetUser.user_metadata?.requestedAccess ?? null;

    await updateUserMetadata(userId, { requestedAccess: null, requestStatus: null });

    return { user: targetUser, requestedAccess };
  };

  return {
    fetchAllRoles,
    fetchUser,
    fetchRoleUsers,
    isAdmin,
    getCurrentUserRoles,
    getAccessRequest,
    submitAccessRequest,
    listUsersWithRoles,
    assignRoleToUser,
    rejectAccessRequest,
  };
};
