
import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
// import flatten from 'lodash/flatten';
import DynamicTopic from './index';

export const dynamicTopicLoader = new DataLoader(ids => DynamicTopic
  .find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`)))
  .catch((err) => { console.log(err); }));
