import { Router } from 'express';
import { createRequireAdmin } from './createRequireAdmin.js';

const runHook = (hook, payload) => {
  if (!hook) return;
  Promise.resolve(hook(payload)).catch((error) =>
    console.error('Admin portal hook failed:', error),
  );
};

export const createAdminPortalRouter = (auth0UserService, { hooks = {} } = {}) => {
  const { onAccessRequested, onRoleAssigned, onRequestRejected } = hooks;
  const requireAdmin = createRequireAdmin(auth0UserService);

  const router = Router();

  router.get('/me', async (req, res) => {
    try {
      const roles = await auth0UserService.getCurrentUserRoles(req.auth.sub);
      res.json({ role: roles[0] ?? null, roles });
    } catch (error) {
      console.error('Failed to load current user role:', error);
      res.status(502).json({ error: 'Failed to load current user role' });
    }
  });

  router.get('/me/access-request', async (req, res) => {
    try {
      const data = await auth0UserService.getAccessRequest(req.auth.sub);
      res.json(data);
    } catch (error) {
      console.error('Failed to load access request:', error);
      res.status(502).json({ error: 'Failed to load access request' });
    }
  });

  router.post('/me/access-request', async (req, res) => {
    try {
      const userId = req.auth.sub;
      const { requestedAccess } = req.body ?? {};

      if (!requestedAccess || typeof requestedAccess !== 'string') {
        return res.status(400).json({ error: 'requestedAccess is required' });
      }

      await auth0UserService.submitAccessRequest(userId, requestedAccess);

      if (onAccessRequested) {
        auth0UserService
          .fetchUser(userId)
          .then((requester) => runHook(onAccessRequested, { requester, requestedAccess }))
          .catch((error) => console.error('Failed to load requester for hook:', error));
      }

      res.json({ requestedAccess, requestStatus: 'PENDING' });
    } catch (error) {
      console.error('Failed to submit access request:', error);
      res.status(502).json({ error: 'Failed to submit access request' });
    }
  });

  router.get('/roles', async (_req, res) => {
    try {
      const roles = await auth0UserService.fetchAllRoles();
      res.json(roles.map((role) => ({ id: role.id, name: role.name })));
    } catch (error) {
      console.error('Failed to load roles:', error);
      res.status(502).json({ error: 'Failed to load roles' });
    }
  });

  router.get('/admin/users', requireAdmin, async (_req, res) => {
    try {
      const rows = await auth0UserService.listUsersWithRoles();

      const hasPendingRequest = (row) => row.requestedAccess && row.requestStatus === 'PENDING';
      rows.sort((a, b) => Number(hasPendingRequest(b)) - Number(hasPendingRequest(a)));

      res.json(rows);
    } catch (error) {
      console.error('Failed to load admin user data:', error);
      res.status(502).json({ error: 'Failed to load users' });
    }
  });

  router.post('/admin/users/:userId/role', requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { roleId, roleIds } = req.body ?? {};
      const idsToAssign = roleIds ?? (roleId ? [roleId] : []);

      if (idsToAssign.length === 0) {
        return res.status(400).json({ error: 'roleId or roleIds is required' });
      }

      const result = await auth0UserService.assignRoleToUser(userId, idsToAssign);

      runHook(onRoleAssigned, { user: result.user, assignedRoles: result.assignedRoles });

      res.json({
        success: true,
        requestedAccess: result.requestedAccess,
        requestStatus: result.requestStatus,
      });
    } catch (error) {
      console.error('Failed to assign role:', error);
      res.status(502).json({ error: 'Failed to assign role' });
    }
  });

  router.post('/admin/users/:userId/reject-request', requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await auth0UserService.rejectAccessRequest(userId);

      if (result.requestedAccess) {
        runHook(onRequestRejected, {
          user: result.user,
          requestedAccess: result.requestedAccess,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Failed to reject access request:', error);
      res.status(502).json({ error: 'Failed to reject access request' });
    }
  });

  return router;
};
