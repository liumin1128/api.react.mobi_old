### 安装并启动 mongodb

docker run -itd --name mongo -p 27017:27017 mongo --auth

### 链接 mongodb

docker exec -it mongo mongo admin

### 创建一个名为 admin，密码为 123456 的用户

db.createUser({ user:'admin',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'}]});

db.auth('admin', '123456')

### 运行 docker

docker run -itd -p 6379:6379 redis
