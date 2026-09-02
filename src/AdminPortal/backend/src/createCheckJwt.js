import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

export const createCheckJwt = ({ domain, audience }) =>
  expressjwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${domain}/.well-known/jwks.json`,
    }),
    audience,
    issuer: `https://${domain}/`,
    algorithms: ['RS256'],
  });
