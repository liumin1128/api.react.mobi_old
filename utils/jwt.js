import jwt from 'jsonwebtoken';
import koaJwt from 'koa-jwt';
import { JWT_SECRET } from '@/config/base';

export const getUserToken = data => jwt.sign({ data }, JWT_SECRET, { expiresIn: '7d' });

// export const getUser = (ctx) => {
//   jwt.verify('token', 'shhhhh');
// };

export const verifyJwt = options => koaJwt({ secret: JWT_SECRET, ...options });

export default koaJwt({ secret: JWT_SECRET }).unless({
  // method: ['GET'],
  path: [/^\//, /^\/graphql/, /^\/oauth/, /^\/rest/],
});
