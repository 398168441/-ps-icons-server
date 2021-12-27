import http from 'http';
import server from './server';
// import logger from './log';

const port = process.env.NODE_PORT || 3001;
const httpServer = http.createServer(server);

httpServer.listen(port, () => {
  if (process.send) {
    process.send('ready');
  }

  // logger.log('info', JSON.stringify(process.env));
});

process.on('SIGINT', () => {
  httpServer.close((err) => process.exit(err ? 1 : 0));
});
