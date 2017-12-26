// 文档地址：
// https://developers.map.com/maps/documentation/geocoding/start

import request from '../../utils/fetch';
import { APP_HUAREN_KEY } from '../../config/map';

export const getAddress = async ({ lat = 40.714224, lng = -73.961452 }) => {
  let url = 'http://apis.map.qq.com/ws/geocoder/v1/';
  url += `?location=${lat},${lng}`;
  url += `&key=${APP_HUAREN_KEY}`;
  const options = { method: 'GET' };
  const data = await request(url, {}, options);
  return data;
};

class Map {
  async address(ctx) {
    try {
      const { lat, lng } = ctx.request.body;
      const data = await getAddress({ lat, lng });
      ctx.body = data;
    } catch (error) {
      console.log('Map address error: ');
      console.log(error);
    }
  }
}

export default new Map();
