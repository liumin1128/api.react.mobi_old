import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import Oauth from './index';

export const oauthLoader = new DataLoader(ids => Oauth.find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`)))
  .catch((err) => {
    console.log(err);
  }));

export const oauthsLoader = new DataLoader(user => Oauth.find({ user })
  .then((data) => {
    return [
      data.map((i) => {
        return {
          from: i.from,
          userInfo: JSON.stringify(i.userInfo),
        };
      }),
    ];
  })
  .catch((err) => {
    console.log(err);
  }));
