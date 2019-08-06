import http from 'http';
import socketio from 'socket.io';
import { SOCKET_PORT } from '@/config/base';

const server = http.createServer();
const io = socketio(server);

io.on('connection', (client) => {
  client.on('event', (data) => {
    /* … */
  });
  client.on('disconnect', () => {
    /* … */
  });
});

server.listen(SOCKET_PORT);
