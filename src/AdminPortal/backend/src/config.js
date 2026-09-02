const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const auth0Domain = requireEnv('AUTH0_DOMAIN');

const rawRoleAssignmentMode = process.env.ROLE_ASSIGNMENT_MODE || 'single';
if (!['single', 'multiple'].includes(rawRoleAssignmentMode)) {
  throw new Error(
    `ROLE_ASSIGNMENT_MODE must be "single" or "multiple", got "${rawRoleAssignmentMode}"`,
  );
}

export const config = {
  port: Number(process.env.PORT) || 4000,
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim()),
  auth0Domain,
  auth0Audience: requireEnv('AUTH0_AUDIENCE'),
  managementClientId: requireEnv('AUTH0_MGMT_CLIENT_ID'),
  managementClientSecret: requireEnv('AUTH0_MGMT_CLIENT_SECRET'),
  managementAudience: process.env.AUTH0_MGMT_AUDIENCE || `https://${auth0Domain}/api/v2/`,
  adminRoleName: process.env.ADMIN_ROLE_NAME || 'Admin',
  defaultRoleName: process.env.DEFAULT_ROLE_NAME || 'User',
  roleAssignmentMode: rawRoleAssignmentMode,
  appName: process.env.APP_NAME || 'the app',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  emailFrom: process.env.EMAIL_FROM,
  frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, ''),
};
