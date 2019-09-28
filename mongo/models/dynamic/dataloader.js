import DataLoader from 'dataloader';
import Dynamic from './index';

// 根据user，拿到动态合计数量
export const userDynamicCountLoader = new DataLoader(users => Promise.all(
  users.map((user) => {
    return Dynamic.countDocuments({ user });
  }),
));
