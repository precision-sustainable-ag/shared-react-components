import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import ManageRoles from './ManageRoles';
import ManageUsers from './ManageUsers';
import { useAdminPortal } from './useAdminPortal';

/**
 * Required props:
 * - apiBaseUrl (string): base URL the backend is mounted at. Must point at a running auth0-api deployment.
 * - getAccessToken: returns a bearer token scoped
 *   to the same Auth0 API the backend's AUTH0_AUDIENCE is set to.
 * - appName (string): identifies this project to auth0-api, sent as an
 *   `X-App-Name` header on every request. Must be one of the names listed
 *   in that deployment's APP_NAMES — see auth0-api's README.
 *
 * Optional props:
 * - showRequests (boolean, default true): show the Requests column with
 *   approve/reject actions for pending access requests.
 * - allowUserDeletion (boolean, default false): show the Actions column with a
 *   delete button (and confirmation dialog) for each user. Deleting removes the
 *   user from Auth0 permanently, so apps must opt in explicitly.
 * - nonAssignableRoles (string[], default []): role names an admin cannot
 *   assign from this UI. Matched case-insensitively by name; the matching
 *   options are shown but disabled in the assign-role dropdown.
 * - allowRoleManagement (boolean, default false): add a Manage Roles tab for
 *   creating and deleting Auth0 roles. The backend's Management API client
 *   needs the `create:roles` and `delete:roles` scopes for this.
 * - title (string, default 'Manage Users'): page heading, or the users tab's
 *   label when role management is enabled.
 */
const USERS_TAB = 'users';
const ROLES_TAB = 'roles';
const tabSx = { textTransform: 'none', fontWeight: 600 };

const AdminPortal = ({
  apiBaseUrl,
  getAccessToken,
  appName,
  showRequests = true,
  allowUserDeletion = false,
  nonAssignableRoles = [],
  allowRoleManagement = false,
  title = 'Manage Users',
}) => {
  if (!apiBaseUrl) {
    throw new Error('<AdminPortal> requires an `apiBaseUrl` prop pointing at the backend API.');
  }
  if (typeof getAccessToken !== 'function') {
    throw new Error(
      '<AdminPortal> requires a `getAccessToken` prop, returning a bearer token for the backend.',
    );
  }
  if (!appName) {
    throw new Error(
      '<AdminPortal> requires an `appName` prop identifying this project to the backend.',
    );
  }

  const {
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
  } = useAdminPortal({ apiBaseUrl, getAccessToken, appName, allowRoleManagement });

  const [activeTab, setActiveTab] = useState(USERS_TAB);
  const showRolesTab = allowRoleManagement && activeTab === ROLES_TAB;

  return (
    <Box sx={{ p: 4 }}>
      {allowRoleManagement ? (
        <Tabs
          value={activeTab}
          onChange={(_event, nextTab) => setActiveTab(nextTab)}
          aria-label="Admin portal sections"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value={USERS_TAB} label={title} sx={tabSx} />
          <Tab value={ROLES_TAB} label="Manage Roles" sx={tabSx} />
        </Tabs>
      ) : (
        <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 3 }}>{title}</Typography>
      )}

      {loadError && <Typography sx={{ color: 'red.main', mb: 2 }}>{loadError}</Typography>}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : showRolesTab ? (
        <ManageRoles
          roles={roles}
          updatingRoleId={updatingRoleId}
          createRole={createRole}
          deleteRole={deleteRole}
        />
      ) : (
        <ManageUsers
          roles={roles}
          userRows={userRows}
          roleAssignmentMode={roleAssignmentMode}
          updatingUserId={updatingUserId}
          assignRole={assignRole}
          rejectRequest={rejectRequest}
          deleteUser={deleteUser}
          showRequests={showRequests}
          allowUserDeletion={allowUserDeletion}
          nonAssignableRoles={nonAssignableRoles}
        />
      )}
    </Box>
  );
};

export default AdminPortal;
