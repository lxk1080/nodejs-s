
/**
 * 1、引入 express
 *
 */

const express = require('express');
const path = require('path');
const formidable = require('express-formidable');

/**
 * 2、创建 express 应用程序
 *
 */

const app = express();

/**
 * 3、指定静态资源根目录
 *
 *    - 第一个参数：为静态资源创建路径前缀，默认为 / ，可以省略
 *      - 例如当参数为'/api' 时，访问方式为：localhost:3000/api/01.jpg
 *
 *    - 可以指定多个静态资源目录
 *
 */

// app.use('/api', express.static(path.join(__dirname, './public')));

app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './static')));

/**
 * 4、写接口
 *    - get 请求，可以直接用 req.query 获取参数。浏览器直接调试
 *    - post 请求，需要先使用中间件，才能获取参数。可以借助 postman 调试下
 *
 *    - 处理 FormData 数据，需要使用 express-formidable 中间件，它也可以处理 json 和 x-www-form-urlencoded，可以说是万能，很强大
 *    - 一般情况下，如果不需要处理 FormData 数据，就不需要使用 express-formidable 中间件
 *
 *    > 注意：express-formidable 中间件和 express.urlencoded、express.json 不能同时使用，否则请求会出问题（无响应）
 *
 */

// app.use(express.json()); // for application/json
// app.use(express.urlencoded({ extended: false })); // for application/x-www-form-urlencoded
app.use(formidable()); // for all

app.get('/', function (req, res) {
  console.log('query:', req.query); // get 请求直接 req.query 获取

  res.send('hello express ! I am Get ~');
});

app.post('/post', function (req, res) {
  // console.log('body:', req.body); // 使用 express.urlencoded 和 express.json 时获取参数的方法

  console.log('fields:', req.fields); // 使用 express-formidable 获取参数的方法
  console.log('files:', req.files); // 使用 express-formidable 获取上传的文件

  res.send('hello express ! I am Post ~');
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
