echo '>>> start mongo'
docker start mongo

echo '>>> start redis'
docker start redis

yarn dev


# docker run -it -v `pwd`:/workspace -w /workspace --privileged=true node:12 yarn
# docker start node -itd -v `pwd`:/workspace -w /workspace -p 3101:3101 --privileged=true node:12 yarn start