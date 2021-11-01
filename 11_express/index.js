
/**
 * 1、引入 express
 *
 */

const express = require('express');
const path = require('path');

/**
 * 2、创建服务
 *
 */

const app = express();

/**
 * 3、指定静态资源根目录
 *
 *    - 第一个参数：为静态资源创建路径前缀，默认为 / ，可以省略
 *      - 访问方式：localhost:3000/api/01.jpg
 *
 *    - 可以指定多个静态资源目录
 *
 */

// app.use('/api', express.static(path.join(__dirname, './public')));

app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './static')));

/**
 * 4、写接口
 *
 */

app.get('/', function (req, res) {
  console.log(req.url);
  res.send('hello express!');
});

/**
 * 5、监听端口
 *
 */

app.listen(3000, function (err) {
  if (!err) {
    console.log('Server running at port 3000 ...');
  }
});
