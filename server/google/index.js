// 文档地址：
// https://developers.google.com/maps/documentation/geocoding/start

import request from '../../utils/fetch';
import { GOOGLE_MAP_KEY } from '../../config/google';

export const getAddress = async ({ lat = 40.714224, lng = -73.961452 }) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAP_KEY}`;
  const data = await request(url);
  return data;
};

class Google {
  async address(ctx) {
    try {
      const data = await getAddress({});
      ctx.body = data;
    } catch (error) {
      console.log('Google address error: ');
      console.log(error);
    }
  }
}

export default new Google();
