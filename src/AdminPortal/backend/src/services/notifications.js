import { config } from '../config.js';
import { sendEmail } from './email.js';

export const createNotifications = (auth0UserService) => {
  const getAdminEmails = async () => {
    const roles = await auth0UserService.fetchAllRoles();
    const adminRole = roles.find((role) => role.name === config.adminRoleName);

    if (!adminRole) {
      console.warn(`Admin role "${config.adminRoleName}" not found — cannot notify admins`);
      return [];
    }

    const adminUsers = await auth0UserService.fetchRoleUsers(adminRole.id);
    return adminUsers.map((user) => user.email).filter(Boolean);
  };

  const notifyAdminsOfAccessRequest = async ({ requesterName, requesterEmail, requestedRole }) => {
    const adminEmails = await getAdminEmails();

    await sendEmail({
      to: adminEmails,
      subject: `New role request: ${requestedRole}`,
      text: `${requesterName} (${requesterEmail}) has requested the "${requestedRole}" role in ${config.appName}.\n\nReview it here: ${config.frontendUrl}`,
    });
  };

  const notifyUserOfRoleAssignment = async ({ userEmail, userName, roleName }) => {
    await sendEmail({
      to: userEmail,
      subject: `Your ${config.appName} access has been updated`,
      text: `Hi ${userName},\n\nYou've been assigned the "${roleName}" role in ${config.appName}.\n\nView your profile here: ${config.frontendUrl}`,
    });
  };

  const notifyUserOfRequestRejection = async ({ userEmail, userName, requestedRole }) => {
    await sendEmail({
      to: userEmail,
      subject: `Your ${config.appName} access request was not approved`,
      text: `Hi ${userName},\n\nYour request for the "${requestedRole}" role in ${config.appName} was not approved.\n\nView your profile here: ${config.frontendUrl}`,
    });
  };

  return { notifyAdminsOfAccessRequest, notifyUserOfRoleAssignment, notifyUserOfRequestRejection };
};
