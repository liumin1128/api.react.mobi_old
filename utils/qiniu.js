import qiniu from 'qiniu';
import { ACCESS_KEY, SECRET_KEY, BUCKET_NAME, EXPIRES_TIME, BUCKET_DOMAIN } from '../config/qiniu';

const mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);
const options = {
  scope: BUCKET_NAME,
  expires: EXPIRES_TIME,
};
const putPolicy = new qiniu.rs.PutPolicy(options);

const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);

export const getQiniuToken = () => {
  return {
    token: putPolicy.uploadToken(mac),
    expires: EXPIRES_TIME,
  };
};

export const fetch = (params) => {
  let resUrl;
  let key;
  if (typeof params === 'string') {
    resUrl = params;
  } else {
    const { url, name } = params;
    resUrl = url;
    key = name;
  }
  return new Promise((resolve, reject) => {
    bucketManager.fetch(resUrl, BUCKET_NAME, key, (err, respBody, respInfo) => {
      if (err) {
        console.log(err);
        reject(err);
        // throw err;
      } else if (respInfo.statusCode === 200) {
        // console.log(respBody.key);
        // console.log(respBody.hash);
        // console.log(respBody.fsize);
        // console.log(respBody.mimeType);
        resolve(respBody);
      } else {
        // console.log(respInfo.statusCode);
        // console.log(respBody);
        reject(respBody);
      }
    });
  });
};

export const fetchToQiniu = (params) => {
  return fetch(params)
    .then(({ key }) => `${BUCKET_DOMAIN}/${key}`)
    .catch((err) => {
      console.log('拉取七牛图片出错');
      console.log(err);
    });
};

