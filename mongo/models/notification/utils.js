export function getActionShowText(type) {
  let actionShowText = '';
  switch (type) {
    case 'zan': {
      actionShowText = '赞了你';
      break;
    }
    case 'comment': {
      actionShowText = '评论了你';
      break;
    }
    case 'reply': {
      actionShowText = '回复了你';
      break;
    }
    case 'like': {
      actionShowText = '喜欢';
      break;
    }
    case 'follow': {
      actionShowText = '关注了你';
      break;
    }
    default: {
      actionShowText = '未知通知';
    }
  }
  return actionShowText;
}
