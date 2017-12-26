import moment from 'moment';
import crypto from 'crypto';
import { parse, stringify } from 'query-string';
import { Daka } from '../../mongo/modals';
import request from '../../utils/fetch';
import { CORPID, CORPSECRET_HUARENHOUSE, REDIRECT_URI } from '../../config/work';
import { getAsync, setAsync, delAsync } from '../../utils/redis';
import { randomString } from '../../utils/common';

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

async function getUserDetailInfo({ token, user_ticket }) {
  try {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserdetail?access_token=${token}`;
    const params = { user_ticket };
    return await request(url, params);
  } catch (error) {
    console.log(error);
  }
}

async function getJsApiTicket({ token }) {
  try {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=${token}`;
    return await request(url);
  } catch (error) {
    console.log(error);
  }
}

class Work {
  async daka(ctx) {
    try {
      const { user } = ctx.state;
      console.log('user');
      console.log(user);

      const {
        location, networkType, time, type, token, ...other
      } = ctx.request.body;

      console.log('location');
      console.log(location);

      console.log('networkType');
      console.log(networkType);

      console.log('time');
      console.log(time);

      console.log('type');
      console.log(type);

      if (location && networkType && time && type !== undefined) {
        const daka = await Daka.create({
          ...other,
          user: user.data,
          location,
          networkType,
          time,
          type,
        });
        ctx.body = {
          status: 200,
          data: daka,
        };
      } else {
        ctx.body = {
          status: 403,
          message: '参数不全',
        };
      }
    } catch (error) {
      console.log('daka error');
      console.log(error);
    }
  }
  async mlogin(ctx) {
    console.log('移动端用户登录');
    // 重定向到认证接口,并配置参数
    let path = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    path += `?appid=${CORPID}`;
    path += '&redirect_uri=https://api.react.mobi/work/mcallback';
    path += '&response_type=code&scope=snsapi_userinfo&agentid=1000008&state=STATE#wechat_redirect';
    // 转发到授权服务器
    ctx.redirect(path);
  }
  async mcallback(ctx) {
    const { code } = ctx.query;
    // await delAsync('wechatWorkAccessToken');
    const token = await getAccessToken();
    const userInfo = await getUserInfo({ token, code });
    if (userInfo.errmsg === 'ok') {
      const userDetail = await getUserDetailInfo({ token, user_ticket: userInfo.user_ticket });
      ctx.body = JSON.stringify({
        code,
        userInfo,
        userDetail,
      });
    }
  }
  async pclogin(ctx) {
    console.log('移动端用户登录');
    // 重定向到认证接口,并配置参数
    let path = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect';
    path += `?appid=${CORPID}`;
    path += '&agentid=1000008';
    path += '&redirect_uri=https://api.react.mobi/work/pccallback';
    path += '&state=web_login@gyoss9';
    // 转发到授权服务器
    ctx.redirect(path);
  }
  async pccallback(ctx) {
    const { code } = ctx.query;
    // await delAsync('wechatWorkAccessToken');
    const token = await getAccessToken();
    const userInfo = await getUserInfo({ token, code });
    if (userInfo.errmsg === 'ok') {
      const userDetail = await getUserDetailInfo({ token, user_ticket: userInfo.user_ticket });
      ctx.body = JSON.stringify({
        code,
        userInfo,
        userDetail,
      });
    }
  }
  async getJsSdkConfig(ctx) {
    try {
      const { url } = ctx.request.body;
      const nonceStr = randomString();
      const timestamp = parseInt(moment().format('X'), 0);
      const token = await getAccessToken();
      // todo jsapi_ticket 需要存缓
      const { errmsg, ticket: jsapi_ticket } = await getJsApiTicket({ token });

      if (errmsg === 'ok') {
        const temp = stringify({
          noncestr: nonceStr, jsapi_ticket, timestamp, url,
        }, { encode: false });

        const hash = crypto.createHash('sha1');
        hash.update(temp);
        const signature = hash.digest('hex');

        // const signature = crypto
        //   .createHash('sha1')
        //   .update(temp)
        //   .digest('hex');

        ctx.body = JSON.stringify({
          appId: CORPID, // 必填，企业微信的corpID
          timestamp, // 必填，生成签名的时间戳
          nonceStr, // 必填，生成签名的随机串
          signature, // 必填，签名，见[附录1](#11974)
        });
      }
    } catch (error) {
      console.log('getJsSdkConfig error');
      console.log(error);
    }


    // ctx.body = JSON.stringify({
    //   beta: true, // 必须这么写，否则在微信插件有些jsapi会有问题
    //   debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //   appId: CORPID, // 必填，企业微信的corpID
    //   timestamp, // 必填，生成签名的时间戳
    //   nonceStr, // 必填，生成签名的随机串
    //   signature: '', // 必填，签名，见[附录1](#11974)
    //   jsApiList: [], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    // });
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
