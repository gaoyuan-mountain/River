/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import webpack from  'webpack';
import config from './webpack.config.js';
import webpackMiddleware from 'koa-webpack-dev-middleware';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';

import koa from  'koa';
import route from 'koa-route';
import koaStatic from  'koa-static';
import gzip from 'koa-gzip';
import bodyParser from 'koa-bodyparser';
import send from 'koa-send';
import nodeCommandParams from 'node-command-params';
import http from 'http';

const app = koa();
app.use(gzip());

// runtime params
// proxy proxy backend server
const runtimeConfig = nodeCommandParams();
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  // mocks
  app.use(route.all('*', function* (_path, next) {
    try {
      let filePath = _path + '.' + this.req.method + '.json';

      fs.accessSync(__dirname + '/mocks' + filePath, fs.R_OK);
      yield send(this, filePath, { root: __dirname + '/mocks' });
    } catch (e) {
      // yield next;
      this.set('Content-Type','text/html');
      this.body = this.webpack.fileSystem.readFileSync(path.join(config.output.path, 'index.html'));
    }
  }));
} else {
  app.use(koaStatic('dist'));
}

http.createServer(app.callback()).listen(3000);
