import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export const client = redis.createClient(6379, '127.0.0.1');
client.on('error', (err) => { console.log(`Error ${err}`); });
client.on('connect', () => {
  console.log('Redis is ready');
});

export const setAsync = (...params) => client.setAsync(params);

export const getAsync = key => client.getAsync(key);

export const delAsync = key => client.delAsync(key);
