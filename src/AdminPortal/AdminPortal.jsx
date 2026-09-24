import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { useState } from 'react';
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
 * - title (string, default 'Manage Users'): heading above the table.
 */
const shrinkToContent = { width: '1%', whiteSpace: 'nowrap' };

const AdminPortal = ({
  apiBaseUrl,
  getAccessToken,
  appName,
  showRequests = true,
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
    assignRole,
    rejectRequest,
    deleteUser,
  } = useAdminPortal({ apiBaseUrl, getAccessToken, appName });

  const [userPendingDelete, setUserPendingDelete] = useState(null);

  const isMultiple = roleAssignmentMode === 'multiple';
  const isDeleting = userPendingDelete !== null && updatingUserId === userPendingDelete.id;

  const handleConfirmDelete = async () => {
    const deleted = await deleteUser(userPendingDelete);
    if (deleted) setUserPendingDelete(null);
  };

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
                <TableCell sx={{ fontWeight: 600, ...shrinkToContent }}>
                  {isMultiple ? 'Assign Roles' : 'Assign Role'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, ...shrinkToContent }} align="right">
                  Actions
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

                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {isMultiple ? (
                        <FormControl size="small" sx={{ minWidth: 220 }}>
                          <Select
                            multiple
                            displayEmpty
                            value={currentRoleIds}
                            renderValue={() => 'Assign roles'}
                            disabled={isUpdating}
                            onChange={(event) => handleMultiAssign(row, event.target.value)}
                            sx={{
                              '& .MuiSelect-select:focus': { outline: 'none' },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                                borderWidth: '1px',
                              },
                            }}
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
                            sx={{
                              '& .MuiSelect-select:focus': { outline: 'none' },
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                                borderWidth: '1px',
                              },
                            }}
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

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        aria-label={`Delete ${row.name}`}
                        disabled={isUpdating}
                        onClick={() => setUserPendingDelete(row)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={userPendingDelete !== null}
        onClose={() => !isDeleting && setUserPendingDelete(null)}
        aria-labelledby="admin-portal-delete-title"
      >
        <DialogTitle id="admin-portal-delete-title">Delete user?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete <strong>{userPendingDelete?.name}</strong> (
            {userPendingDelete?.email}) and remove their access. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserPendingDelete(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPortal;
