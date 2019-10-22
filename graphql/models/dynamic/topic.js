import uniq from 'lodash/uniq';
import { sequence } from '@/utils/promise';
import DynamicTopic from '@/mongo/models/dynamic/topic';

export function getTopic(str) {
  const list = str.match(/#(\S*?)#/g);
  if (!list) return null;
  return uniq(list.map(i => i.replace(/#/g, '')).filter(i => i));
}

export async function getTopics(topicStrList) {
  const topics = [];

  await sequence(
    topicStrList.map(topic => async () => {
      const that = await DynamicTopic.findOne({ title: topic });
      if (that) {
        topics.push(that);
        return;
      }
      const last = await DynamicTopic.findOne().sort('-_id');
      const number = (last || { number: 1000 }).number + 1;
      const data = await DynamicTopic.create({ title: topic, number });
      topics.push(data);
    }),
  );

  return topics;
}
