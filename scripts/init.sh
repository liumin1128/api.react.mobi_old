# echo '>>> stop all container'
# docker stop $(docker ps -a -q) 

# echo '>>> remove all container'
# docker rm $(docker ps -a -q) 

echo '>>> create mongo container'
docker run -itd --name mongo -p 27017:27017 mongo --auth

echo '>>> create redis container'
docker run -itd --name redis -p 6379:6379 redis

echo '>>> start mongo container'
docker start mongo 

echo '>>> wait 3 second'
sleep 1

echo '>>> wait 2 second'
sleep 1

echo '>>> wait 1 second'
sleep 1

echo '>>> init mongo'
docker exec -i mongo mongo admin <<EOF
use admin
db.createUser({ user:'admin',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'}]});
db.auth('admin', '123456')
use react
db.createUser({ user:'react',pwd:'123456',roles:[ { role:'readWrite', db: 'react'}]});
db.auth('react', '123456')
exit;
EOF

# echo '>>> stop mongo'
# docker stop mongo

