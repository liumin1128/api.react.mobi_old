import fetch from 'node-fetch';
import { Oauth } from '../mongo/modals';

const fetch1 = (url, params = {}, options = {}) => {
  return fetch(url, {
    method: 'POST',
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


const fetch2 = (url, options = {}) => {
  return fetch(url, {
    method: 'POST',
    ...options,
  })
    .then((res) => {
      return res.text();
    })
    .catch((e) => {
      console.log(e);
    });
};

export const sentOutlookEmail = async (userId, params) => {
  try {
    const url = 'https://graph.microsoft.com/v1.0/me/messages';

    const oauth = await Oauth.findOne({ user: userId });

    console.log('-----------------oauth-----------------');
    // console.log(userId);
    // console.log(oauth);

    const token = oauth.data.token.access_token;
    console.log(token);

    const data = await fetch1(url, params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const urlSend = `https://graph.microsoft.com/v1.0/me/messages/${data.id}/send`;

    const data2 = await fetch2(urlSend, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });


    return data2;
  } catch (error) {
    console.log('error');
    console.log(error);
    return error;
  }
};
