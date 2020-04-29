# 创建docker 容器
docker run -itd --name mongo -p 27017:27017 mongo --auth
docker run -itd --name redis -p 6379:6379 redis
# docker run -itd --name node node:latest

# 启动docker 容器
docker start mongo
docker start redis
# docker start node

# docker run -it -v `pwd`:/workspace -w /workspace --privileged=true node:12 yarn
# docker start node -itd -v `pwd`:/workspace -w /workspace -p 3101:3101 --privileged=true node:12 yarn start
yarn dev