import crypto from 'crypto';

export const md5Encode = (str) => {
  const hash = crypto.createHash('md5');
  hash.update(str);
  const encode = hash.digest('hex');
  return encode;
};

export const md5Decode = (str) => {
  return crypto.createHash('md5').update(str, 'utf8').digest('hex');
};
