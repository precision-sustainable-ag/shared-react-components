import nodemailer from 'nodemailer';
import { config } from '../config.js';

const isEmailConfigured = () =>
  Boolean(config.smtpHost && config.smtpUser && config.smtpPassword && config.emailFrom);

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, text }) => {
  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);

  if (!isEmailConfigured()) {
    console.warn(`Email not configured — skipping "${subject}" to ${recipients.join(', ')}`);
    return;
  }

  if (recipients.length === 0) {
    console.warn(`No recipients for email "${subject}" — skipping`);
    return;
  }

  try {
    await getTransporter().sendMail({
      from: config.emailFrom,
      to: recipients,
      subject,
      text,
    });
  } catch (error) {
    console.error(`Failed to send email "${subject}" to ${recipients.join(', ')}:`, error);
  }
};
