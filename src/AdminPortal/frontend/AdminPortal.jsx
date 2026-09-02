import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useAdminPortal } from './useAdminPortal';

/**
 * Drop-in admin table for managing Auth0 users/roles against a backend
 * running the AdminPortal Express server (see ../backend).
 *
 * Required props:
 * - apiBaseUrl (string): base URL the backend is mounted at, e.g.
 *   `${BACKEND_URL}/api`. Must point at a running AdminPortal backend.
 * - getAccessToken (() => Promise<string>): returns a bearer token scoped
 *   to the same Auth0 API the backend's AUTH0_AUDIENCE is set to (e.g. the
 *   Auth0 React SDK's getAccessTokenSilently).
 *
 * Optional props:
 * - roleAssignmentMode ('single' | 'multiple', default 'single'): whether a
 *   user can hold one role or several. MUST match the backend's own
 *   ROLE_ASSIGNMENT_MODE env var — the two are separate processes with no
 *   shared source of truth, so keep them in sync by hand.
 * - showRequests (boolean, default true): show the Requests column with
 *   approve/reject actions for pending access requests.
 * - title (string, default 'Manage Users'): heading above the table.
 */
const AdminPortal = ({
  apiBaseUrl,
  getAccessToken,
  roleAssignmentMode = 'single',
  showRequests = true,
  title = 'Manage Users',
}) => {
  if (!apiBaseUrl) {
    throw new Error('<AdminPortal> requires an `apiBaseUrl` prop pointing at the backend API.');
  }
  if (typeof getAccessToken !== 'function') {
    throw new Error(
      '<AdminPortal> requires a `getAccessToken` prop: () => Promise<string>, returning a bearer token for the backend.',
    );
  }
  if (!['single', 'multiple'].includes(roleAssignmentMode)) {
    throw new Error('<AdminPortal> `roleAssignmentMode` must be "single" or "multiple".');
  }

  const { roles, userRows, isLoading, loadError, updatingUserId, assignRole, rejectRequest } =
    useAdminPortal({ apiBaseUrl, getAccessToken });

  const isMultiple = roleAssignmentMode === 'multiple';

  const handleSingleAssign = (row, roleId) => {
    const matchedRole = roles.find((role) => role.id === roleId);
    if (!matchedRole || roleId === row.role?.id) return;

    assignRole(row, roleId, [matchedRole]);
  };

  const handleMultiAssign = (row, roleIds) => {
    const matchedRoles = roles.filter((role) => roleIds.includes(role.id));
    assignRole(row, roleIds, matchedRoles);
  };

  const handleApprove = (row) => {
    const requestedRole = roles.find((role) => role.name === row.requestedAccess);
    if (!requestedRole) return;

    if (isMultiple) {
      const currentIds = (row.roles ?? []).map((role) => role.id);
      const nextIds = currentIds.includes(requestedRole.id)
        ? currentIds
        : [...currentIds, requestedRole.id];
      handleMultiAssign(row, nextIds);
    } else {
      handleSingleAssign(row, requestedRole.id);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 3 }}>{title}</Typography>

      {loadError && <Typography sx={{ color: 'red.main', mb: 2 }}>{loadError}</Typography>}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{isMultiple ? 'Roles' : 'Role'}</TableCell>
                {showRequests && <TableCell sx={{ fontWeight: 600 }}>Requests</TableCell>}
                <TableCell sx={{ fontWeight: 600 }}>
                  {isMultiple ? 'Assign Roles' : 'Assign Role'}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {userRows.map((row) => {
                const isPending = row.requestedAccess && row.requestStatus === 'PENDING';
                const isUpdating = updatingUserId === row.id;
                const currentRoleIds = (row.roles ?? (row.role ? [row.role] : [])).map(
                  (role) => role.id,
                );

                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      {isMultiple
                        ? (row.roles ?? []).length > 0
                          ? row.roles.map((role) => (
                              <Chip key={role.id} label={role.name} size="small" sx={{ mr: 0.5 }} />
                            ))
                          : 'No role assigned'
                        : (row.role?.name ?? 'No role assigned')}
                    </TableCell>

                    {showRequests && (
                      <TableCell>
                        {isPending ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography sx={{ color: 'red.main', fontSize: 'inherit' }}>
                              {row.requestedAccess}
                            </Typography>

                            <IconButton
                              size="small"
                              aria-label={`Approve ${row.requestedAccess} request for ${row.name}`}
                              color="success"
                              disabled={isUpdating}
                              onClick={() => handleApprove(row)}
                            >
                              <CheckCircleOutlineIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              aria-label={`Reject ${row.requestedAccess} request for ${row.name}`}
                              color="error"
                              disabled={isUpdating}
                              onClick={() => rejectRequest(row)}
                            >
                              <HighlightOffIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          'None'
                        )}
                      </TableCell>
                    )}

                    <TableCell>
                      {isMultiple ? (
                        <FormControl size="small" sx={{ minWidth: 220 }}>
                          <Select
                            multiple
                            displayEmpty
                            value={currentRoleIds}
                            renderValue={() => 'Assign roles'}
                            disabled={isUpdating}
                            onChange={(event) => handleMultiAssign(row, event.target.value)}
                          >
                            {roles.map((role) => (
                              <MenuItem key={role.id} value={role.id}>
                                <Checkbox checked={currentRoleIds.includes(role.id)} />
                                <ListItemText primary={role.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                          <Select
                            displayEmpty
                            value=""
                            renderValue={() => 'Assign role'}
                            disabled={isUpdating}
                            onChange={(event) => handleSingleAssign(row, event.target.value)}
                          >
                            {roles.map((role) => (
                              <MenuItem
                                key={role.id}
                                value={role.id}
                                disabled={role.id === row.role?.id}
                              >
                                {role.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                      {isUpdating && <CircularProgress size={16} sx={{ ml: 1 }} />}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminPortal;
