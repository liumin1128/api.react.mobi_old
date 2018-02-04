PRO_DIR="../api.react.mobi"
echo "start--------------------"
cd $PRO_DIR
source ~/.nvm/nvm.sh
# nvm use 8.9.0
# echo "切换到8.9.0"
echo "Node 版本："
node -v
echo "cd $PRO_DIR"
echo "pull git code"
git pull
echo "安装依赖"
yarn
echo "restart nodeblog"
# pm2 restart api.react.mobi
yarn pm2
echo "finished----------"
