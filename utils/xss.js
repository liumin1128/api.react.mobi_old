import { FilterXSS } from 'xss';

const options = {
  whiteList: [], // 白名单为空，表示过滤所有标签
  stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
  stripIgnoreTagBody: ['script'], // script标签较特殊，需要过滤标签中间的内容
  onTag(tag, html, options) {
    if (tag === 'script') {
      return '[b2d_10]';
    }
  },
}; // 自定义规则

const xss = new FilterXSS(options);

console.log(xss.process('<script>alert()</script><span style="color: rgb(102, 102, 102); font-family: Roboto, Helvetica, Arial, sans-serif; letter-spacing: 0.15008px;">&lt;script&gt;alert(\'test\')&lt;/script&gt;</span>'));

export default xss;
