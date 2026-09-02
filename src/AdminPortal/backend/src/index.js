import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import {
  createAdminPortalRouter,
  createAuth0UserService,
  createCheckJwt,
  createManagementApiClient,
} from './core.js';
import { createNotifications } from './services/notifications.js';

const managementApiClient = createManagementApiClient({
  domain: config.auth0Domain,
  clientId: config.managementClientId,
  clientSecret: config.managementClientSecret,
  audience: config.managementAudience,
});

const auth0UserService = createAuth0UserService(managementApiClient, {
  adminRoleName: config.adminRoleName,
  defaultRoleName: config.defaultRoleName,
  roleAssignmentMode: config.roleAssignmentMode,
});

const notifications = createNotifications(auth0UserService);

const checkJwt = createCheckJwt({ domain: config.auth0Domain, audience: config.auth0Audience });

const adminPortalRouter = createAdminPortalRouter(auth0UserService, {
  hooks: {
    onAccessRequested: ({ requester, requestedAccess }) =>
      notifications.notifyAdminsOfAccessRequest({
        requesterName: requester.name || requester.email || requester.user_id,
        requesterEmail: requester.email || 'unknown',
        requestedRole: requestedAccess,
      }),
    onRoleAssigned: ({ user, assignedRoles }) =>
      notifications.notifyUserOfRoleAssignment({
        userEmail: user.email,
        userName: user.name || user.email || user.user_id,
        roleName: assignedRoles[0]?.name ?? 'Unknown',
      }),
    onRequestRejected: ({ user, requestedAccess }) =>
      notifications.notifyUserOfRequestRejection({
        userEmail: user.email,
        userName: user.name || user.email || user.user_id,
        requestedRole: requestedAccess,
      }),
  },
});

const app = express();

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', checkJwt, adminPortalRouter);

// biome-ignore lint/correctness/noUnusedFunctionParameters: express identifies error handlers by arity (4 params)
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`${config.appName} admin portal backend listening on port ${config.port}`);
  console.log(`Role assignment mode: ${config.roleAssignmentMode}`);
});
