export const sleep = (a = 1000, b = 2000) => new Promise((resolve) => {
  const timer = a + Math.ceil(Math.random() * (b > a ? b - a : 0));
  console.log(`等待【${(timer / 1000).toFixed(2)}】秒...`);
  return setTimeout(resolve, timer);
});

