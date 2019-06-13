export const sleep = ms => () => new Promise(resolve => setTimeout(resolve, ms));

export function sequence(promises) {
//   return new Promise(((resolve, reject) => {
//     let resolvedCounter = 0;
//     const promiseNum = promises.length;
//     const resolvedValues = [];

  //     function callBack() {
  //       return Promise.resolve(promises[resolvedCounter])().then((value) => {
  //         resolvedCounter += 1;
  //         resolvedValues.push(value);
  //         if (resolvedCounter >= promiseNum) {
  //           resolve(resolvedValues);
  //         }
  //         callBack();
  //       }).catch(reject);
  //     }

  //     return callBack();
  //   }));

  return new Promise((resolve, reject) => {
    let i = 0;
    const result = [];

    function callBack() {
      return promises[i]().then((res) => {
        i += 1;
        result.push(res);
        if (i === promises.length) {
          resolve(result);
        }
        callBack();
      }).catch(reject);
    }

    return callBack();
  });
}


// // const list = [];
// // for (let i = 0; i < 5; ++i) {
// //   list.push(i);
// // }


// const sss = list.map(number => () => new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log(`$${number}`);
//     resolve(number);
//   }, 1000);
// }));


// console.log('sss');
// console.log(sss);
// sequence([1, 2, 3, 4, 5].map(number => () => new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log(`$${number}`);
//     resolve(number);
//   }, 1000);
// }))).then((data) => {
//   console.log('成功');
//   console.log(data);
// }).catch((err) => {
//   console.log('失败');
//   console.log(err);
// });
