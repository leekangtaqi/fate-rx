/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import express from 'express';
import config from './config/environment';
import compression from 'compression';
import { createServer } from 'http';
import mongoose from 'mongoose';
import userRouter from './controllers/user.controller'
var serveStatic = require('serve-static')
var bodyParser = require('body-parser');


mongoose.connect(config.mongo.uris, config.mongo.options);
let conn = mongoose.connection;
conn.on('connected',function(){console.info('[MonoDB]:开盘');});
conn.once('open', function(){console.info('[MonoDB]:开户');/*global.gfs = Grid(conn.db);*/});
conn.on('error', function(err){console.error(err);});
conn.on('disconnected', function(){console.warn('[MonoDB]:熔断');});
conn.on('reconnected', function(){console.info('[MonoDB]:重开');});

// Setup server
var app = express();
app.set('env', process.env.NODE_ENV);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user', userRouter)

var server = createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('91拼团微信客户端以 %s 模式, 监听 %d 端口', config.env, config.port);
});

// start a webpack-dev-server with config
if(process.env.NODE_ENV === 'development'){
  let webpack = require('webpack');
  let WebpackDevServer = require('webpack-dev-server');
  let webpackConfig = require('../webpack.config.js');
  let port = webpackConfig.devServer.port;
  let host = webpackConfig.devServer.host;

  new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    hot: webpackConfig.devServer.hot,
    historyApiFallback: true,
    proxy: {
      "/*": `http://localhost:${config.port}`,
      "/api/*": `http://localhost:${config.port}`,
      "/config/*": `http://localhost:${config.port}`,
      "/score/*": `http://localhost:${config.port}`
    },
    quiet: true,
    noInfo: webpackConfig.devServer.noInfo,
    stats: webpackConfig.devServer.stats
  }).listen(port, host, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(`[system] Webpack Dev Server is startup, Listening at ${host}:${port}`);
  });  
}

// Expose app
exports = module.exports = app;
