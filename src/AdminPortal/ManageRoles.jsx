import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const shrinkToContent = { width: '1%', whiteSpace: 'nowrap' };
const ROLES_PER_PAGE = 10;
const EMPTY_ROLE_FORM = { name: '', description: '' };

const ManageRoles = ({ roles, updatingRoleId, createRole, deleteRole }) => {
  const [rolePendingDelete, setRolePendingDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [roleForm, setRoleForm] = useState(EMPTY_ROLE_FORM);
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleRoles = roles.filter(
    (role) =>
      !normalizedQuery ||
      role.name?.toLowerCase().includes(normalizedQuery) ||
      role.description?.toLowerCase().includes(normalizedQuery),
  );

  // Clamped here rather than in an effect so that deleting the last row on
  // the last page falls back to the previous page without an empty render.
  const pageCount = Math.max(1, Math.ceil(visibleRoles.length / ROLES_PER_PAGE));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const pageRoles = visibleRoles.slice(
    currentPage * ROLES_PER_PAGE,
    (currentPage + 1) * ROLES_PER_PAGE,
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPageIndex(0);
  };

  const isDeleting = rolePendingDelete !== null && updatingRoleId === rolePendingDelete.id;

  const handleConfirmDelete = async () => {
    const deleted = await deleteRole(rolePendingDelete);
    if (deleted) setRolePendingDelete(null);
  };

  const openCreateDialog = () => {
    setRoleForm(EMPTY_ROLE_FORM);
    setCreateError('');
    setIsCreateOpen(true);
  };

  const handleRoleFormChange = (field) => (event) => {
    setRoleForm((prevForm) => ({ ...prevForm, [field]: event.target.value }));
    setCreateError('');
  };

  const trimmedName = roleForm.name.trim();
  const trimmedDescription = roleForm.description.trim();
  const canSubmitRole = Boolean(trimmedName && trimmedDescription) && !isCreating;

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmitRole) return;

    setIsCreating(true);
    const error = await createRole({ name: trimmedName, description: trimmedDescription });
    setIsCreating(false);

    if (error) {
      setCreateError(error);
    } else {
      setIsCreateOpen(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Search by name or description"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '100%', maxWidth: 360 }}
          slotProps={{
            htmlInput: { 'aria-label': 'Search roles by name or description' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
          Create Role
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, ...shrinkToContent }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRoles.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary' }}>
                  {normalizedQuery ? 'No roles match the current search' : 'No roles found'}
                </TableCell>
              </TableRow>
            )}

            {pageRoles.map((role) => {
              const isUpdating = updatingRoleId === role.id;

              return (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell sx={{ color: role.description ? 'inherit' : 'text.secondary' }}>
                    {role.description || 'No description'}
                  </TableCell>
                  <TableCell align="center">
                    {role.isProtected ? (
                      <Tooltip title="This role is required by the app and cannot be deleted">
                        {/* Disabled buttons don't fire the events Tooltip listens for. */}
                        <span>
                          <IconButton size="small" aria-label={`Delete ${role.name}`} disabled>
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    ) : (
                      <IconButton
                        size="small"
                        aria-label={`Delete ${role.name}`}
                        disabled={isUpdating}
                        onClick={() => setRolePendingDelete(role)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {visibleRoles.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            disabled={currentPage === 0}
            onClick={() => setPageIndex(currentPage - 1)}
          >
            Back
          </Button>
          <Typography aria-live="polite" sx={{ fontSize: '14px' }}>
            Page {currentPage + 1} of {pageCount}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPageIndex(currentPage + 1)}
          >
            Next
          </Button>
        </Box>
      )}

      <Dialog
        open={isCreateOpen}
        onClose={() => !isCreating && setIsCreateOpen(false)}
        aria-labelledby="admin-portal-create-role-title"
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={handleCreateSubmit} noValidate>
          <DialogTitle id="admin-portal-create-role-title">Create role</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              fullWidth
              margin="dense"
              label="Name"
              value={roleForm.name}
              onChange={handleRoleFormChange('name')}
              disabled={isCreating}
            />
            <TextField
              required
              fullWidth
              multiline
              minRows={2}
              margin="dense"
              label="Description"
              value={roleForm.description}
              onChange={handleRoleFormChange('description')}
              disabled={isCreating}
            />
            {createError && (
              <Typography role="alert" sx={{ color: 'error.main', fontSize: '14px', mt: 1 }}>
                {createError}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!canSubmitRole}
              startIcon={isCreating ? <CircularProgress size={16} color="inherit" /> : null}
            >
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={rolePendingDelete !== null}
        onClose={() => !isDeleting && setRolePendingDelete(null)}
        aria-labelledby="admin-portal-delete-role-title"
      >
        <DialogTitle id="admin-portal-delete-role-title">Delete role?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete the <strong>{rolePendingDelete?.name}</strong> role and
            remove it from every user who has it. Users left with no other role will be given the
            default role. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRolePendingDelete(null)} disabled={isDeleting}>
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
    </>
  );
};

export default ManageRoles;
