import { useEffect, useMemo, useState } from 'react';
import { createAdminPortalApi } from './adminPortalApi';

const sortByPendingRequestFirst = (rows) => {
  const hasPendingRequest = (row) => row.requestedAccess && row.requestStatus === 'PENDING';
  return [...rows].sort((a, b) => Number(hasPendingRequest(b)) - Number(hasPendingRequest(a)));
};

export const useAdminPortal = ({ apiBaseUrl, getAccessToken }) => {
  const api = useMemo(
    () => createAdminPortalApi({ apiBaseUrl, getAccessToken }),
    [apiBaseUrl, getAccessToken],
  );

  const [roles, setRoles] = useState([]);
  const [userRows, setUserRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const [rows, allRoles] = await Promise.all([api.fetchUsers(), api.fetchRoles()]);

        if (isMounted) {
          setRoles(allRoles);
          setUserRows(sortByPendingRequestFirst(rows));
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
  }, [api]);

  const assignRole = async (userRow, roleIdOrIds, matchedRoles) => {
    setUpdatingUserId(userRow.id);

    try {
      const result = await api.assignRole(userRow.id, roleIdOrIds);

      setUserRows((prevRows) =>
        sortByPendingRequestFirst(
          prevRows.map((row) =>
            row.id === userRow.id
              ? {
                  ...row,
                  roles: matchedRoles,
                  role: matchedRoles[0] ?? null,
                  requestedAccess: result.requestedAccess,
                  requestStatus: result.requestStatus,
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
        sortByPendingRequestFirst(
          prevRows.map((row) =>
            row.id === userRow.id ? { ...row, requestedAccess: null, requestStatus: null } : row,
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

  return { roles, userRows, isLoading, loadError, updatingUserId, assignRole, rejectRequest };
};
