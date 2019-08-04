import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import User from './index';

export const userLoader = new DataLoader(ids => User.find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`)))
  .catch((err) => {
    console.log(err);
  }));
