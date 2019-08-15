import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import Oauth from './index';

export const oauthLoader = new DataLoader(ids => Oauth.find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`)))
  .catch((err) => {
    console.log(err);
  }));
