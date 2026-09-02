# AdminPortal

A self-contained user/role management admin panel backed by Auth0, in two
halves: `frontend/` (a React component) and `backend/` (an Express server it
talks to).

Why a backend at all: the Auth0 Management API endpoints needed to list all
users, list all roles, and assign roles to _other_ users require scopes that
Auth0 will only grant to a Machine-to-Machine application authenticating with
a client secret. A browser app (a SPA) can never hold that secret safely, so
this backend exists purely to hold it and proxy those calls.

## Setup in a new project

### 1. Auth0 Dashboard

- Register a **custom API** for this backend (Applications → APIs → Create
  API). Its Identifier is just a label both sides use to agree tokens are
  legitimate — it doesn't need to resolve to anything.
- Create a **Machine-to-Machine application**, authorize it against
  **Auth0 Management API** (a different, built-in API — not the one above),
  with only these scopes: `read:users`, `read:roles`, `read:role_members`,
  `create:role_members`, `delete:role_members`, `update:users`.
- Your existing SPA application (the one users log in through) needs no
  changes other than requesting tokens for the custom API's audience.

### 2. Backend

```
cd AdminPortal/backend
npm install
cp .env
npm run dev
```

### 3. Frontend

```jsx
import AdminPortal from "./AdminPortal/frontend";
import { useAuth0 } from "@auth0/auth0-react";

const AdminPage = () => {
  const { getAccessTokenSilently } = useAuth0();

  return (
    <AdminPortal
      apiBaseUrl={`${import.meta.env.VITE_ADMIN_PORTAL_API_URL}/api`}
      getAccessToken={getAccessTokenSilently}
      roleAssignmentMode="single" // must match the backend's ROLE_ASSIGNMENT_MODE
      title="Manage Users"
    />
  );
};
```

`AdminPortal` throws immediately with a descriptive error if `apiBaseUrl` or
`getAccessToken` are missing, or if `roleAssignmentMode` is misspelled — it
won't fail silently or half-render.

## Required vs. optional

| Where                 | Required                                                                             | Optional (with defaults)                                                         |
| --------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `<AdminPortal>` props | `apiBaseUrl`, `getAccessToken`                                                       | `roleAssignmentMode` ('single'), `showRequests` (true), `title` ('Manage Users') |
| Backend `.env`        | `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `AUTH0_MGMT_CLIENT_ID`, `AUTH0_MGMT_CLIENT_SECRET` | everything else — see `.env.example`                                             |

`ROLE_ASSIGNMENT_MODE` (backend) and `roleAssignmentMode` (frontend prop)
must agree — they're read independently by two separate processes with no
shared source of truth, so keep them in sync by hand.

## What each side actually does

- `frontend/AdminPortal.jsx` — the table UI (users, roles, requests, assign controls).
- `frontend/useAdminPortal.js` — data loading + mutation state, decoupled from rendering.
- `frontend/adminPortalApi.js` — the fetch client, scoped to whatever `apiBaseUrl` is passed in.
- `backend/src/index.js` — wires everything together and starts the Express server; the only file with any app-specific glue (email notification text).
- `backend/src/core.js` — the reusable pieces: a cached Management API client, the Auth0 user/role service, JWT verification, and the Express router. None of these read env vars directly — they're all factories taking explicit config, so they can be wired up by any consumer.
- `backend/src/services/` — email notifications (nodemailer/SMTP), the one part likely to differ most between projects.
