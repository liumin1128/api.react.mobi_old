import crypto from 'crypto';

export const md5Encode = str =>
  crypto.createHash('md5').update(str, 'utf8').digest('hex');

export const aesEncode = (data, key = 'react.mobi') => {
  const cipher = crypto.createCipher('aes192', key);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

export const aesDecode = (encrypted, key = 'react.mobi') => {
  const decipher = crypto.createDecipher('aes192', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
