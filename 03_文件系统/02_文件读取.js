
const fs = require('fs');

/**
 * 1、简单文件读取（小文件）
 *    - fs.readFile(path[, options], callback)
 *      - 第二个参数 options 是可选的，它可以是一个对象也可以是一个字符串指定编码，设置编码为 utf-8 ，则不需要使用 data.toString() 也能得到中文字符串
 *
 */

// fs.readFile('./data/haha.txt', 'utf-8', function (err, data) {
//   if (!err) {
//     // console.log(data.toString());
//     console.log(data);
//   }
// });

/**
 * 2、流式文件读取（适用于大文件）
 *    - fs.createReadStream(path[, options])
 *      - 读取一个可读流中的数据，必须要为可读流绑定一个 data 事件，data 事件绑定完毕，它会自动开始读取数据
 *      - 不需要自己写关闭方法，数据读取完会自动关闭
 *      - 每次最多读 65536 byte，也就是 64 kb
 *
 *      > 使用可读流的管道（pipe），可以直接将可读流的数据传输到可写流中
 *
 */

// 创建一个可写流，以供复制读取的数据

fs.mkdir('./dist', function (err) {
  if (!err) {
    console.log('创建 dist 文件夹成功！');
  }
});

const ws = fs.createWriteStream('./dist/add.jpg');

ws.once('open', function () {
  console.log('可写流打开了！');
});

ws.once('close', function () {
  console.log('可写流关闭了！');
});

// 创建一个可读流，读取数据，以供复制

const rs = fs.createReadStream('./data/girl.jpg');

rs.once('open', function () {
  console.log('可读流打开了！');
});

rs.once('close', function () {
  console.log('可读流关闭了！');
  ws.end();
});

// 原始方法
// rs.on('data', function (data) {
//   console.log(data.length); // 读取数据的大小
//   console.log(data); // 每次读取的 buffer 数据
//   ws.write(data); // 复制数据到可写流中
// });

// 直接使用管道
rs.pipe(ws);
