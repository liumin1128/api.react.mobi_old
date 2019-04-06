import fetch from 'node-fetch';

export default (url, params = {}, options = {}) => {
  console.log('url, params');
  console.log(url, params);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(params),
    ...options,
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      console.log(e);
    });
};
