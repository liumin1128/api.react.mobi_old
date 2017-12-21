import moment from 'moment';
import request from '../../utils/fetch';
import { CORPID, CORPSECRET_DAKA } from '../../config/work';
import { getAsync, setAsync, delAsync } from '../../utils/redis';

async function getAccessToken() {
  try {
    const token = await getAsync('wechatWorkAccessToken');
    if (token) {
      console.log('本地发现一个Token');
      return token;
    } else {
      console.log('本地未发现Token');
      const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORPID}&corpsecret=${CORPSECRET_DAKA}`;
      const data = await request(url);
      if (data.access_token) {
        await setAsync('wechatWorkAccessToken', data.access_token, 'EX', data.expires_in);
        return data.access_token;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAllUser({ token }) {
  try {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=${token}&department_id=${1}&fetch_child=${1}`;
    return await request(url);
  } catch (error) {
    console.log(error);
  }
}

class Work {
  // 用户注册
  async test(ctx) {
    await delAsync('wechatWorkAccessToken');
    const token = await getAccessToken();
    const { userlist } = await getAllUser({ token });
    const useridlist = userlist.map(i => i.userid);
    const url = `https://qyapi.weixin.qq.com/cgi-bin/checkin/getcheckindata?access_token=${token}`;

    const params = {
      access_token: token,
      opencheckindatatype: 1,
      starttime: parseInt(moment().subtract(30, 'days').format('X'), 0),
      endtime: parseInt(moment().format('X'), 0),
      useridlist,
    };

    console.log(params);
    const data = await request(url, params);
    console.log('data');
    console.log(data);
    ctx.body = data;
  }
}

export default new Work();
