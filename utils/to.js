// to.js
// export default function to(promise) {
//   return promise.then((data) => {
//     return [null, data];
//   })
//     .catch(err => [err]);
// }

import to from './to.js';

async function asyncTask(cb) {
  let err,
    user,
    savedTask;

  [err, user] = await to(UserModel.findById(1));
  if (!user) return cb('No user found');

  [err, savedTask] = await to(TaskModel({ userId: user.id, name: 'Demo Task' }));
  if (err) return cb('Error occurred while saving task');

  if (user.notificationsEnabled) {
    const [err] = await to(NotificationService.sendNotification(user.id, 'Task Created'));
    if (err) return cb('Error while sending notification');
  }

  cb(null, savedTask);
}
