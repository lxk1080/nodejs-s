
/**
 * 1、引入模块
 *
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * 2、创建 server 实例
 *
 */

const server = http.createServer();

/**
 * 3、请求事件绑定，当接收到客户端的请求时，就会触发 request 事件
 *
 *    - req：关于请求的所有信息
 *      - url：返回 url，url 是不包含域名的，url 总是以 / 开头的
 *      - method：请求类型，GET / POST，注意是大写
 *      - socket.remoteAddress：客户端 ip，是内网 ip
 *      - socket.remotePort：客户端的访问端口
 *
 *    - res：响应对象
 *      - write：用来给客户端发送响应数据，可以使用多次，但是最后一定要使用 end 来结束响应，否则客户端会一直等待
 *      - end：结束响应，告诉客户端，我的话说完了。一般都用 end 传输数据，并结束响应
 *      - 响应内容只能是二进制数据（buffer）或者字符串
 *      - 服务器默认发送的数据是 utf8，浏览器不知道，会按照当前操作系统的默认编码去解析，中文操作系统默认是 gbk，所以得设置响应头，告诉浏览器发送的内容是什么编码的
 *      - Content-Type
 *        - text/plain 表示发送的纯文本，html 标签不会解析
 *        - text/html 解析 html 文本
 *        - image/jpeg 图片
 *
 *    > path.extname：获取后缀名（从右往左遇到第一个小数点截断，带上小数点返回）
 *
 */

const www = './public';

const suffixMap = {
  '.txt': 'text/plain;',
  '.jpg': 'image/jpeg;',
};

server.on('request', function (req, res) {
  if (req.url === '/favicon.ico') {
    return res.end();
  }

  console.log('url:', req.url);
  console.log('method:', req.method);
  console.log('remoteAddress:', req.socket.remoteAddress);
  console.log('remotePort:', req.socket.remotePort);

  // res.write('hello');
  // res.write(' world');
  // res.end();

  // 去掉参数，对应浏览器端的 location.pathname
  const pathname = req.url.split('?')[0];

  // GET 请求
  if (req.method === 'GET') {
    console.log('GET Received');
    console.log('GET Query:', req.url.split('?')[1]);
  }

  // POST 请求处理，可以使用 postman 模拟
  if (req.method === 'POST') {
    console.log('POST Received');
    let data = '';
    req.on('data', stream => {
      data += stream;
    });
    req.on('end', () => {
      console.log('POST Body:', data);
    });
  }

  // 特殊的请求-1
  if (pathname === '/home') {
    const filePath = path.resolve(__dirname, './resource/index.html');
    fs.readFile(filePath, function (err, data) {
      if (err) return console.log(err);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(data);
    });
    return;
  }

  // 特殊的请求-2
  if (pathname === '/girl') {
    const filePath = path.resolve(__dirname, './resource/girl.jpg');
    fs.readFile(filePath, function (err, data) {
      if (err) return console.log(err);
      res.setHeader('Content-Type', 'image/jpeg;');
      res.end(data);
    });
    return;
  }

  // 寻找静态资源
  const filePath = path.resolve(__dirname, www + pathname);
  fs.readFile(filePath, function (err, data) {
    // 未找到资源
    if (err) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('啥也没有！');
    }
    // 找到了资源
    res.setHeader('Content-Type', `${suffixMap[path.extname(pathname)]} charset=utf-8`);
    res.end(data);
  });
});

/**
 * 4、监听端口，监听完成后，自动启动服务器
 *    - 默认访问 IPv6（如果没有开启 IPv6，则会访问 IPv4），指定 hostname 为 '0.0.0.0'，让其访问 IPv4
 *
 */

server.listen(3000, '0.0.0.0', function () {
  console.log('server started at port: 3000 ...');
});

/**
 * plus、
 *
 *    1、顺便一提：当采用无分号代码风格的时候，只需要注意：当一行代码是以 ( [ ` 开头的时候，需要在前面补一个分号，避免语法错误
 *
 *    2、服务端渲染和客户端渲染的区别？
 *      - 客户端渲染不利于 SEO 搜索引擎优化
 *        - 服务端渲染是可以被爬虫抓取到的，客户端异步渲染是很难被爬虫抓取到的
 *        - 例如京东的商品列表（需要 SEO 优化）就是服务端渲染，而评论列表（不需要 SEO 优化）是客户端异步渲染
 *
 */
