import crypto from 'crypto';
import { stringify } from 'query-string';
import fetch from 'node-fetch';
import { randomString } from './common';

import { APP_KEY, APP_SECRET } from '../config/netease';

export const request = (url, params) => {
  const AppKey = APP_KEY;
  const Nonce = randomString();
  const CurTime = `${parseInt(new Date().getTime() / 1000, 0)}`;

  const hash = crypto.createHash('sha1');
  hash.update(`${APP_SECRET}${Nonce}${CurTime}`);
  const CheckSum = hash.digest('hex');

  return fetch(url, {
    method: 'POST',
    headers: {
      // accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;',
      AppKey,
      Nonce,
      CurTime,
      CheckSum,
    },
    body: stringify(params),
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      console.log(e);
    });
};
