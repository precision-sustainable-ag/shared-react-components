import AdminPortal from './AdminPortal';

const ROLES = [
  { id: 'role_admin', name: 'Admin', description: 'Full access, including this portal' },
  { id: 'role_editor', name: 'Editor', description: 'Can create and edit content' },
  { id: 'role_viewer', name: 'Viewer', description: 'Read-only access' },
];

// Mirrors auth0-api, which won't delete the admin or default role, and gives
// the default role to users left with none after a role is deleted.
const DEFAULT_ROLE_NAME = 'Viewer';
const PROTECTED_ROLE_NAMES = new Set(['Admin', DEFAULT_ROLE_NAME]);

const jsonResponse = (body, status = 200) =>
  Promise.resolve(
    new Response(status === 204 ? null : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

const installMockAdminPortalBackend = (apiBaseUrl, initialUsers, roleAssignmentMode = 'single') => {
  if (!window.__adminPortalMockBackends__) {
    const realFetch = window.fetch.bind(window);
    window.__adminPortalMockBackends__ = new Map();
    window.fetch = (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      const backend = [...window.__adminPortalMockBackends__.entries()].find(([prefix]) =>
        url.startsWith(prefix),
      );
      return backend ? backend[1](url, init) : realFetch(input, init);
    };
  }

  const users = initialUsers.map((user) => ({ ...user }));
  const roles = ROLES.map((role) => ({ ...role }));
  let nextRoleNumber = 1;

  const toAdminRole = (role) => ({ ...role, isProtected: PROTECTED_ROLE_NAMES.has(role.name) });

  window.__adminPortalMockBackends__.set(apiBaseUrl, async (url, init = {}) => {
    const path = url.slice(apiBaseUrl.length);
    const method = init.method ?? 'GET';

    if (method === 'GET' && path === '/config') return jsonResponse({ roleAssignmentMode });
    if (method === 'GET' && path === '/roles') {
      return jsonResponse(roles.map(({ id, name }) => ({ id, name })));
    }
    if (method === 'GET' && path === '/admin/roles') return jsonResponse(roles.map(toAdminRole));
    if (method === 'GET' && path === '/admin/users') return jsonResponse(users);

    const assignMatch = path.match(/^\/admin\/users\/([^/]+)\/role$/);
    if (method === 'POST' && assignMatch) {
      const user = users.find((row) => row.id === decodeURIComponent(assignMatch[1]));
      if (!user) return jsonResponse({ message: 'Not found' }, 404);

      const body = JSON.parse(init.body ?? '{}');
      if (Array.isArray(body.roleIds)) {
        user.roles = roles.filter((role) => body.roleIds.includes(role.id));
      } else {
        user.role = roles.find((role) => role.id === body.roleId) ?? null;
      }
      user.requestedAccess = null;
      user.requestStatus = null;
      user.requestSource = null;
      return jsonResponse({ requestedAccess: null, requestStatus: null, requestSource: null });
    }

    const rejectMatch = path.match(/^\/admin\/users\/([^/]+)\/reject-request$/);
    if (method === 'POST' && rejectMatch) {
      const user = users.find((row) => row.id === decodeURIComponent(rejectMatch[1]));
      if (user) {
        user.requestedAccess = null;
        user.requestStatus = null;
        user.requestSource = null;
      }
      return jsonResponse(null, 204);
    }

    const deleteMatch = path.match(/^\/admin\/users\/([^/]+)$/);
    if (method === 'DELETE' && deleteMatch) {
      const index = users.findIndex((row) => row.id === decodeURIComponent(deleteMatch[1]));
      if (index === -1) return jsonResponse({ message: 'Not found' }, 404);

      users.splice(index, 1);
      return jsonResponse(null, 204);
    }

    if (method === 'POST' && path === '/admin/roles') {
      const { name, description } = JSON.parse(init.body ?? '{}');
      if (roles.some((role) => role.name.toLowerCase() === name.toLowerCase())) {
        return jsonResponse({ error: `A role named "${name}" already exists` }, 409);
      }

      const role = { id: `role_custom_${nextRoleNumber++}`, name, description };
      roles.push(role);
      return jsonResponse(toAdminRole(role), 201);
    }

    const deleteRoleMatch = path.match(/^\/admin\/roles\/([^/]+)$/);
    if (method === 'DELETE' && deleteRoleMatch) {
      const index = roles.findIndex((role) => role.id === decodeURIComponent(deleteRoleMatch[1]));
      if (index === -1) return jsonResponse({ error: 'Role not found' }, 404);
      if (PROTECTED_ROLE_NAMES.has(roles[index].name)) {
        return jsonResponse({ error: `The "${roles[index].name}" role cannot be deleted` }, 400);
      }

      const [removed] = roles.splice(index, 1);
      const defaultRole = roles.find((role) => role.name === DEFAULT_ROLE_NAME);
      const reassignedUserIds = [];

      users.forEach((user) => {
        const hadRole =
          user.role?.id === removed.id || user.roles?.some((role) => role.id === removed.id);
        if (!hadRole) return;

        const remainingRoles = (user.roles ?? []).filter((role) => role.id !== removed.id);
        if (remainingRoles.length === 0) {
          reassignedUserIds.push(user.id);
          if (user.roles) user.roles = [defaultRole];
          user.role = defaultRole;
        } else {
          if (user.roles) user.roles = remainingRoles;
          if (user.role?.id === removed.id) user.role = remainingRoles[0];
        }
      });

      return jsonResponse({
        defaultRole: toAdminRole(defaultRole),
        reassignedUserIds,
        unassignedUserIds: [],
      });
    }

    return jsonResponse({ message: `Unhandled mock route: ${method} ${path}` }, 404);
  });
};

const mockGetAccessToken = () => Promise.resolve('mock-access-token');

const meta = {
  title: 'Layout/AdminPortal',
  component: AdminPortal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

installMockAdminPortalBackend(
  'mock://admin-portal/single',
  [
    {
      id: 'u1',
      name: 'Test Name',
      email: 'test@example.com',
      role: ROLES[0],
      requestedAccess: null,
      requestStatus: null,
    },
    {
      id: 'u2',
      name: 'Test Name 2',
      email: 'test2@example.com',
      role: ROLES[2],
      requestedAccess: 'Editor',
      requestStatus: 'PENDING',
      requestSource: 'PROFILE',
    },
    {
      id: 'u3',
      name: 'Test Name 3',
      email: 'test3@example.com',
      role: null,
      requestedAccess: null,
      requestStatus: null,
    },
    {
      id: 'u4',
      name: 'Test Name 4',
      email: 'test4@example.com',
      role: ROLES[2],
      requestedAccess: 'Editor',
      requestStatus: 'PENDING',
      requestSource: 'REGISTRATION',
    },
  ],
  'single',
);

export const SingleRole = {
  args: {
    apiBaseUrl: 'mock://admin-portal/single',
    getAccessToken: mockGetAccessToken,
    appName: 'STORYBOOK',
    allowUserDeletion: true,
    nonAssignableRoles: ['Admin'],
  },
};

installMockAdminPortalBackend(
  'mock://admin-portal/multiple',
  [
    {
      id: 'u1',
      name: 'Test Name',
      email: 'test@example.com',
      roles: [ROLES[0]],
      requestedAccess: null,
      requestStatus: null,
    },
    {
      id: 'u2',
      name: 'Test Name 2',
      email: 'test2@example.com',
      roles: [ROLES[1], ROLES[2]],
      requestedAccess: null,
      requestStatus: null,
    },
  ],
  'multiple',
);

export const MultipleRoles = {
  args: {
    apiBaseUrl: 'mock://admin-portal/multiple',
    getAccessToken: mockGetAccessToken,
    appName: 'STORYBOOK',
    title: 'Manage Team Access',
    allowUserDeletion: true,
  },
};

installMockAdminPortalBackend('mock://admin-portal/no-requests', [
  {
    id: 'u1',
    name: 'Test Name',
    email: 'test@example.com',
    role: ROLES[0],
    requestedAccess: null,
    requestStatus: null,
  },
]);

export const WithoutRequestsColumn = {
  args: {
    apiBaseUrl: 'mock://admin-portal/no-requests',
    getAccessToken: mockGetAccessToken,
    appName: 'STORYBOOK',
    showRequests: false,
  },
};

installMockAdminPortalBackend(
  'mock://admin-portal/role-management',
  [
    {
      id: 'u1',
      name: 'Test Name',
      email: 'test@example.com',
      roles: [ROLES[0]],
      role: ROLES[0],
      requestedAccess: null,
      requestStatus: null,
    },
    {
      id: 'u2',
      name: 'Test Name 2',
      email: 'test2@example.com',
      roles: [ROLES[1]],
      role: ROLES[1],
      requestedAccess: null,
      requestStatus: null,
    },
  ],
  'single',
);

export const WithRoleManagement = {
  args: {
    apiBaseUrl: 'mock://admin-portal/role-management',
    getAccessToken: mockGetAccessToken,
    appName: 'STORYBOOK',
    allowUserDeletion: true,
    allowRoleManagement: true,
  },
};
