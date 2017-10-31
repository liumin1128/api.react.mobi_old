import jwt from 'jsonwebtoken';
import { SECRET } from '../config';

export const getUserToken = data => jwt.sign({ data }, SECRET, { expiresIn: '7d' });
