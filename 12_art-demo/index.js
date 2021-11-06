
const express = require('express');
const path = require('path');
const router = require('./routes');

const app = express();

/**
 * 1、使用 art-template 模板引擎，具体使用方法可以参考 art-template 官方文档
 *
 *    - 这里虽然没有直接 require('art-template')，但是也需要安装 art-template 包
 *
 *    - app.engine 指定模板引擎，第一个参数用来指定引擎使用的模板文件后缀名
 *
 *    - app.set(key, value) 方法用于设置键值对，可以存储任何自定义的值，并用 app.get(key) 获取值
 *      - 某些 key 可用于配置服务器的行为，例如下面的 views，它指定了模板文件的所在文件夹，默认为 process.cwd() + '/views'
 *
 */

app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, 'views'));

/**
 * 2、处理 post 数据
 *
 *    > 注意：处理 post 数据要写在挂载路由之前
 *
 */

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * 3、挂载路由
 *
 */

app.use(router);

/**
 * 4、监听端口
 *
 */

app.listen(3000, function (err) {
  if (!err) {
    console.log('app running at port 3000 ...');
  }
});
