import fetch from 'node-fetch';
import fs from 'fs';
import http from 'http';
import { resolve, reject } from '@/node_modules/any-promise/index';

export default (url, options = {}) => {
  return fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    },
    ...options,
  });
};

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36';

/**
 * 图片下载器
 * @param {string} url - 图片的网络地址
 * @param {string} dest - 保存图片的地址
 * @param {number} timeout - 超时时间，默认 3 分钟
 * @param {number} retries - 重试次数，默认重试 2 次
 */
export function pictureDownloader(url, dest, timeout = 3 * 60 * 1000, retries = 2) {
  return new Promise((resolve, reject) => {
    let isRetry = false;
    const req = http.request(url, res => res.pipe(fs.createWriteStream(dest)));
    req.setTimeout(timeout, () => {
      req.abort();
      isRetry = true;
    });
    req.setHeader('User-Agent', userAgent);
    req.on('error', () => {
      isRetry = true;
    });
    req.on('close', () => {
      // 重试时，将超时时间递增 1 分钟
      if (isRetry && retries > 0) {
        pictureDownloader(url, dest, timeout + 60 * 1000, retries - 1);
      } else {
        reject();
      }
    });
    req.end();
  });
}
