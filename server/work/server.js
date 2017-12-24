import moment from 'moment';
import request from '../../utils/fetch';
import { CORPID, CORPSECRET_HUARENHOUSE, REDIRECT_URI } from '../../config/work';
import { getAsync, setAsync, delAsync } from '../../utils/redis';

async function getAccessToken() {
  try {
    const token = await getAsync('wechatWorkAccessToken');
    if (token) {
      console.log('本地发现一个Token');
      return token;
    } else {
      console.log('本地未发现Token');
      const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORPID}&corpsecret=${CORPSECRET_HUARENHOUSE}`;
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

async function getUserInfo({ token, code }) {
  try {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${token}&code=${code}`;
    return await request(url);
  } catch (error) {
    console.log(error);
  }
}

class Work {
  async mlogin(ctx) {
    console.log('移动端用户登录');
    // 重定向到认证接口,并配置参数
    let path = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    path += `?appid=${CORPID}`;
    path += `&redirect_uri=${REDIRECT_URI}`;
    path += '&response_type=code&scope=snsapi_userinfo&agentid=1000008&state=STATE#wechat_redirect';
    // 转发到授权服务器
    ctx.redirect(path);
  }
  async callback(ctx) {
    const { code } = ctx.query;
    await delAsync('wechatWorkAccessToken');
    const token = await getAccessToken();
    const data = await getUserInfo({ token, code });

    console.log('callback code');
    console.log(code);

    console.log('callback data2');
    console.log(data);

    ctx.body = JSON.stringify({
      code,
      data,
    });
  }
  async test(ctx) {
    try {
      const token = await getAccessToken();
      console.log(token);
      const data = await getUserInfo({ token, code: 'c2Twv3_g5KrthZVUw2WcTwtpGPuw_lX_UOJL2cWS-Xc' });
      console.log('data');
      console.log(data);
      ctx.body = data;
    } catch (error) {
      console.log(error);
    }
  }
  // 获取微信自带打卡数据
  async test2222(ctx) {
    // await delAsync('wechatWorkAccessToken');
    const token = await getAccessToken();
    const { userlist } = await getAllUser({ token });
    const useridlist = userlist.map(i => i.userid);
    const url = `https://qyapi.weixin.qq.com/cgi-bin/checkin/getcheckindata?access_token=${token}`;

    const params = {
      access_token: token,
      opencheckindatatype: 3,
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
