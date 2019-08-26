export const randomCode = (length = 6) => {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

export const randomString = (len = 32) => {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i += 1) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const checkPasswordStrength = (password) => {
  if (password.length < 8) {
    return 0;
  }
  let strength = 0;
  if (password.match(/([0-9])+/)) {
    strength += 1;
  }
  if (password.match(/([a-z])+/)) {
    strength += 1;
  }
  if (password.match(/([A-Z])+/)) {
    strength += 1;
  }
  if (password.match(/[^a-zA-Z0-9]+/)) {
    strength += 1;
  }
  // const reg = new RegExp(
  //   "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]",
  // );
  // if (password.match(reg)) {
  //   strength += 1;
  // }
  return strength;
};
