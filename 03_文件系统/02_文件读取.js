
/**
 * 说明：文件读取相关
 *    - 以下示例，路径用的都是相对路径（相对于 node 启动目录），测试的时候需要注意下
 */

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
 * 2、使用 buffer 缓冲数据，进行读写操作
 *    - 一般情况下的读写，是从一个文件读数据到内存中，然后把内存中的数据写到另一个文件中。不适合大文件，容易造成内存泄漏，所以需要使用 buffer 缓冲区
 *
 *    - 关于 fs.read，读取文件数据存储到缓冲区
 *      - 关于参数，以下面代码为例
 *        - rfd 当前被打开的文件的文件描述符
 *        - buf 读入数据存储到该缓冲区
 *        - 2 从 buf 的哪个位置开始写
 *        - 4 要写入的长度
 *        - 1 从文件的哪个位置开始读取
 *        - byteLength 存储在 buf 中的字节长度
 *        - readBuffer 读操作完成后的 buf 数据
 *
 *    - 关于 fs.write，从缓冲区中取数据写入文件
 *      - 需要在打开文件的时候，传递 flags 为 w，这样才能写，默认为 r
 *      - 关于参数，以下面代码为例
 *        - wfd 当前被打开的文件的文件描述符
 *        - readBuffer 从该缓冲区拿数据写到文件
 *        - 2 从 readBuffer 的哪个位置开始读
 *        - 4 要读取的长度
 *        - 0 从文件的哪个位置开始写入，这个参数一般不用传，默认都是顶格写入，多次写入时，会紧接着上一次结束的位置继续写
 *        - byteLength 写到文件中的字节长度
 *        - originBuffer 写文件用到的源数据，也就是 readBuffer 数据
 *
 */

// // 新建一个 buffer，用于存储读取的数据，注意这个缓冲区的大小要设置的比文件内容大，不然会报错
// const buf = Buffer.alloc(10)
//
// 打开读
// fs.open('./data/nums.txt', (err, rfd) => {
//   if (err) return console.log(err)
//   console.log('rfd ==>', rfd)
//
//   fs.read(rfd, buf, 2, 4, 1, (err, byteLength, readBuffer) => {
//     if (err) return console.log(err)
//     console.log('read byteLength ==>', byteLength)
//     console.log('readBuffer ==>', readBuffer)
//     console.log('readBuffer string ==>', readBuffer.toString())
//
//     // 打开写
//     fs.open('./data/nums_writed.txt', 'w', (err, wfd) => {
//       if (err) return console.log(err)
//       console.log('wfd ==>', wfd)
//
//       fs.write(wfd, readBuffer, 2, 4, 0, (err, byteLength, originBuffer) => {
//         if (err) return console.log(err)
//         console.log('write byteLength ==>', byteLength)
//         console.log('originBuffer ==>', originBuffer)
//         console.log('originBuffer string ==>', originBuffer.toString())
//
//         // 关闭
//         fs.close(rfd)
//         fs.close(wfd)
//       })
//     })
//   })
// })

/**
 * 3、流式文件读取（适用于大文件）
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
