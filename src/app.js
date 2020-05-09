import '@babel/polyfill';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import startChannels from 'core/startChannels';
import routers from 'routes';
import configIO from 'config/socket';
import socketIO from 'socket.io';
import redisAdapter from 'socket.io-redis';

const debug = require('debug')('app');
const app = express();

const io = socketIO();
app.io = io;
io.adapter(redisAdapter({ host: 'redis' }));
startChannels(app);
configIO(io);

app.set('env', process.env.NODE_ENV || 'develop');
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(routers);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // TODO: logging error to file
  debug('Something went wrong: ', err);
  res.sendStatus(err.status || 500);
});

export default app;
