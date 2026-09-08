import AdminPortal from './AdminPortal';

const ROLES = [
  { id: 'role_admin', name: 'Admin' },
  { id: 'role_editor', name: 'Editor' },
  { id: 'role_viewer', name: 'Viewer' },
];

const jsonResponse = (body, status = 200) =>
  Promise.resolve(
    new Response(status === 204 ? null : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

const installMockAdminPortalBackend = (apiBaseUrl, initialUsers) => {
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

  window.__adminPortalMockBackends__.set(apiBaseUrl, async (url, init = {}) => {
    const path = url.slice(apiBaseUrl.length);
    const method = init.method ?? 'GET';

    if (method === 'GET' && path === '/roles') return jsonResponse(ROLES);
    if (method === 'GET' && path === '/admin/users') return jsonResponse(users);

    const assignMatch = path.match(/^\/admin\/users\/([^/]+)\/role$/);
    if (method === 'POST' && assignMatch) {
      const user = users.find((row) => row.id === decodeURIComponent(assignMatch[1]));
      if (!user) return jsonResponse({ message: 'Not found' }, 404);

      const body = JSON.parse(init.body ?? '{}');
      if (Array.isArray(body.roleIds)) {
        user.roles = ROLES.filter((role) => body.roleIds.includes(role.id));
      } else {
        user.role = ROLES.find((role) => role.id === body.roleId) ?? null;
      }
      user.requestedAccess = null;
      user.requestStatus = null;
      return jsonResponse({ requestedAccess: null, requestStatus: null });
    }

    const rejectMatch = path.match(/^\/admin\/users\/([^/]+)\/reject-request$/);
    if (method === 'POST' && rejectMatch) {
      const user = users.find((row) => row.id === decodeURIComponent(rejectMatch[1]));
      if (user) {
        user.requestedAccess = null;
        user.requestStatus = null;
      }
      return jsonResponse(null, 204);
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

installMockAdminPortalBackend('mock://admin-portal/single', [
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
  },
  {
    id: 'u3',
    name: 'Test Name 3',
    email: 'test3@example.com',
    role: null,
    requestedAccess: null,
    requestStatus: null,
  },
]);

export const SingleRole = {
  args: {
    apiBaseUrl: 'mock://admin-portal/single',
    getAccessToken: mockGetAccessToken,
    roleAssignmentMode: 'single',
  },
};

installMockAdminPortalBackend('mock://admin-portal/multiple', [
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
]);

export const MultipleRoles = {
  args: {
    apiBaseUrl: 'mock://admin-portal/multiple',
    getAccessToken: mockGetAccessToken,
    roleAssignmentMode: 'multiple',
    title: 'Manage Team Access',
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
    showRequests: false,
  },
};
