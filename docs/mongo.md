docker ps
docker stats
docker stop
docker restart

### 安装并启动 mongodb

docker run -itd --name mongo -p 27017:27017 mongo --auth

### 链接 mongodb

docker exec -it mongo mongo admin

### 创建一个名为 admin，密码为 123456 的用户

db.createUser({ user:'admin',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'}]});

### 获得权限

db.auth('admin', '123456')

### 切换到目标数据库

use react

### 创建一个名为 react，密码为 123456 的用户

db.createUser({ user:'react',pwd:'123456',roles:[ { role:'readWrite', db: 'react'}]});

### 获得权限

db.auth('react', '123456')

### 运行 docker

docker run -itd -p 6379:6379 redis
