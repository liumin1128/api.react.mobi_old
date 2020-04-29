
docker run -itd --name mongo -p 27017:27017 mongo --auth
docker run -itd --name redis -p 6379:6379 redis

docker start mongo
docker start redis

# docker run -it -v `pwd`:/workspace -w /workspace --privileged=true node:12 yarn
# docker run -it -v `pwd`:/workspace -w /workspace -p 3101:3101 --privileged=true node:12 yarn start
yarn dev