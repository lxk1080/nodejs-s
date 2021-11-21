
/**
 * 说明：关于 express 中间件
 *
 */

const express = require('express');
const app = express();

/**
 * 1、理解：中间件就是对最终要使用的对象在中间做了一系列的处理过程（可以想象一个自来水厂，中间的过滤、活性炭、漂白等等，就类似于中间件的功能，最后得到可饮用水）
 *    - 匹配所有请求的中间件（无第一个参数）
 *    - 匹配指定路径的中间件（设置第一个参数）
 *    - 匹配请求方法和请求路径的中间件，例如：app.get、app.post
 *    - 匹配对应参数数量的中间件，这种情况发生在：执行 next 方法时传递了参数。一般配合路径匹配，可以用来做错误处理（不过我觉得还不如直接用一个自定义的方法来处理，更好理解）
 *
 *    > 处理请求的中间件，例如：express.json
 *    > 功能型的中间件，例如：express.static
 *
 * 2、关于 use 方法的两个参数，第一个参数是路径，默认为：/ ，第二个参数为一个处理的函数
 *    - 第一个参数不传，则匹配所有的请求
 *    - 第一个参数传，则匹配参数路径对应的请求
 *
 * 3、处理函数有三个参数，req、res、next
 *    - 中间件的执行是按顺序的，顺序就是写代码的顺序
 *    - 在一个中间件的最后执行 next 方法，才能继续执行下一个匹配的中间件，本质是嵌套调用
 *    - 由于 next 是嵌套调用，所以如果在 next 方法后，还有代码，它会在下一个中间件执行完成后执行（也就是 next 方法执行完成后）
 *    - next 方法可以传递参数，如果传递了参数，则 req、res、next 三个参数依次向后瞬移，并且 next 方法会自动匹配拥有参数数量的中间件
 *
 */

app.use(function (req, res, next) {
  console.log('我是所有请求都会经过的~');
  next();
});

app.use('/a', function (req, res, next) {
  console.log('我只匹配以 /a 开头的请求~');
  next();
});

app.use('/b', function (req, res, next) {
  console.log('我只匹配以 /b 开头的请求~');
  next();
});

app.get('/a', function (req, res, next) {
  console.log('我只匹配以 /a 开头的 get 请求~');
  next();
});

app.post('/b', function (req, res, next) {
  console.log('我只匹配以 /b 开头的 post 请求~');
  next();
});

app.use(function (req, res, next) {
  console.log('我是请求之后的中间件，前面的中间件不要忘了 next 哦~');
  res.send('完美~'); // send 方法是不会中断函数执行的哦~
  next(); // 先执行下一个中间件输出 111，如果下一个中间件内又有 next，则继续执行那个 next 方法
  console.log(222); // 上一句 next() 执行完成后，再执行这句代码，输出 222
});

app.use(function (req, res, next) {
  console.log(111);
  next('error'); // 将会匹配处理函数有四个参数的中间件
});

// 此中间件将不会被匹配
app.use(function () {
  console.log('end');
});

// 对应上面传递了一个参数的 next 方法（注意：这个中间件必须要传四个参数（即使后面的参数没有被使用），才能被匹配到）
app.use(function (err, req, res, next) {
  console.log(err);
});

/**
 * 监听端口
 *
 */

app.listen(3000, function (err) {
  if (!err) {
    console.log('Server Up!');
  }
});
