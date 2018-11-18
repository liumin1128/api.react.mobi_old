import crypto from 'crypto';

const secretId = 'AKIDjOxKUSVsJcklbF46Lh9dWJxQnDoNmMXX';
const secretKey = 'lNnEg84wgFdqrmkdj2GJBrLShqncL2nB';
const appid = '1253997281';


export function getAuthorization() {
  const pexpired = 86400;
  const userid = 0;
  const now = parseInt(Date.now() / 1000, 0);
  const rdm = parseInt(Math.random() * (2 ** 32), 0);
  const plainText = `a=${appid}&k=${secretId}&e=${now + pexpired}&t=${now}&r=${rdm}${userid}&f=`;
  const data = Buffer.from(plainText, 'utf8');
  const res = crypto.createHmac('sha1', secretKey).update(data).digest();
  const bin = Buffer.concat([res, data]);
  const sign = bin.toString('base64');
  return sign;
}
