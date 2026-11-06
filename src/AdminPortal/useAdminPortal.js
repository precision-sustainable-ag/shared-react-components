import { useEffect, useMemo, useState } from 'react';
import { createAdminPortalApi } from './adminPortalApi';

// Pending new-user registrations first, then pending profile requests, then
// everyone else. Requests without a requestSource rank as profile requests.
const requestPriority = (row) => {
  if (!row.requestedAccess || row.requestStatus !== 'PENDING') return 2;
  return row.requestSource === 'REGISTRATION' ? 0 : 1;
};

const sortByRequestPriority = (rows) =>
  [...rows].sort((a, b) => requestPriority(a) - requestPriority(b));

// With role management on, roles come from the admin endpoint, which adds
// each role's description and whether the server allows deleting it.
export const useAdminPortal = ({
  apiBaseUrl,
  getAccessToken,
  appName,
  allowRoleManagement = false,
}) => {
  const api = useMemo(
    () => createAdminPortalApi({ apiBaseUrl, getAccessToken, appName }),
    [apiBaseUrl, getAccessToken, appName],
  );

  const [roles, setRoles] = useState([]);
  const [userRows, setUserRows] = useState([]);
  const [roleAssignmentMode, setRoleAssignmentMode] = useState('single');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const [rows, allRoles, config] = await Promise.all([
          api.fetchUsers(),
          allowRoleManagement ? api.fetchAdminRoles() : api.fetchRoles(),
          api.fetchConfig(),
        ]);

        if (isMounted) {
          setRoles(allRoles);
          setUserRows(sortByRequestPriority(rows));
          setRoleAssignmentMode(config.roleAssignmentMode);
        }
      } catch (error) {
        console.error('Failed to load admin user data:', error);
        if (isMounted) {
          setLoadError('Failed to load users.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [api, allowRoleManagement]);

  useEffect(() => {
    if (!loadError) return;

    const timeoutId = setTimeout(() => setLoadError(''), 3000);
    return () => clearTimeout(timeoutId);
  }, [loadError]);

  const assignRole = async (userRow, roleIdOrIds, matchedRoles) => {
    setUpdatingUserId(userRow.id);

    try {
      const result = await api.assignRole(userRow.id, roleIdOrIds);

      setUserRows((prevRows) =>
        sortByRequestPriority(
          prevRows.map((row) =>
            row.id === userRow.id
              ? {
                  ...row,
                  roles: matchedRoles,
                  role: matchedRoles[0] ?? null,
                  requestedAccess: result.requestedAccess,
                  requestStatus: result.requestStatus,
                  requestSource: result.requestSource,
                }
              : row,
          ),
        ),
      );
    } catch (error) {
      console.error('Failed to assign role:', error);
      setLoadError(`Failed to assign role to ${userRow.name}.`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const rejectRequest = async (userRow) => {
    setUpdatingUserId(userRow.id);

    try {
      await api.rejectAccessRequest(userRow.id);

      setUserRows((prevRows) =>
        sortByRequestPriority(
          prevRows.map((row) =>
            row.id === userRow.id
              ? { ...row, requestedAccess: null, requestStatus: null, requestSource: null }
              : row,
          ),
        ),
      );
    } catch (error) {
      console.error('Failed to reject access request:', error);
      setLoadError(`Failed to reject request from ${userRow.name}.`);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Resolves true on success so the caller can close its confirmation dialog.
  const deleteUser = async (userRow) => {
    setUpdatingUserId(userRow.id);

    try {
      await api.deleteUser(userRow.id);
      setUserRows((prevRows) => prevRows.filter((row) => row.id !== userRow.id));
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      setLoadError(`Failed to delete ${userRow.name}.`);
      return false;
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Resolves to null on success, or an error message for the create dialog to
  // show inline (the page-level error sits behind the open dialog).
  const createRole = async ({ name, description }) => {
    try {
      const role = await api.createRole({ name, description });
      setRoles((prevRoles) => [...prevRoles, role]);
      return null;
    } catch (error) {
      console.error('Failed to create role:', error);
      return error.serverMessage ?? `Failed to create role ${name}.`;
    }
  };

  // Resolves true on success so the caller can close its confirmation dialog.
  // Auth0 unassigns a deleted role from every user, and the backend gives the
  // default role to anyone left with none, so mirror both locally.
  const deleteRole = async (role) => {
    setUpdatingRoleId(role.id);

    try {
      const {
        defaultRole,
        reassignedUserIds = [],
        unassignedUserIds = [],
      } = (await api.deleteRole(role.id)) ?? {};
      const reassignedIds = new Set(reassignedUserIds);

      setRoles((prevRoles) => prevRoles.filter((candidate) => candidate.id !== role.id));
      setUserRows((prevRows) =>
        prevRows.map((row) => {
          if (defaultRole && reassignedIds.has(row.id)) {
            return {
              ...row,
              ...(row.roles && { roles: [defaultRole] }),
              role: defaultRole,
            };
          }

          const remainingRoles = row.roles?.filter((candidate) => candidate.id !== role.id);
          return {
            ...row,
            ...(remainingRoles && { roles: remainingRoles }),
            role: row.role?.id === role.id ? (remainingRoles?.[0] ?? null) : row.role,
          };
        }),
      );

      if (unassignedUserIds.length > 0) {
        setLoadError(
          `Deleted role ${role.name}, but ${unassignedUserIds.length} user(s) could not be given the default role and now have no role.`,
        );
      }
      return true;
    } catch (error) {
      console.error('Failed to delete role:', error);
      setLoadError(error.serverMessage ?? `Failed to delete role ${role.name}.`);
      return false;
    } finally {
      setUpdatingRoleId(null);
    }
  };

  return {
    roles,
    userRows,
    roleAssignmentMode,
    isLoading,
    loadError,
    updatingUserId,
    updatingRoleId,
    assignRole,
    rejectRequest,
    deleteUser,
    createRole,
    deleteRole,
  };
};
