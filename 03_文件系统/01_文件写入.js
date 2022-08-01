
/**
 * 说明：文件系统（File System），需要使用核心模块 fs
 *    - nodejs 中所有的方法都有两种，异步和同步，不带 Sync 的为异步方法，后面带 Sync 的是同步方法
 *
 */

const fs = require('fs');

/**
 * 1、文件的同步写入
 *
 *    - 1. 打开文件
 *      - fs.openSync(path[, flags[, mode]])
 *        - path：要打开文件的路径
 *        - flags：打开文件要做的操作类型，默认：r
 *        - mode：设置文件的操作权限，默认：0o666
 *        - 返回值：表示文件描述符的整数
 *
 *    - 2. 向文件写入内容
 *      - fs.writeSync(fd, string[, position[, encoding]])
 *        - fd：表示文件描述符的整数
 *        - string：要写入的内容
 *        - position：写入的起始位置，默认：0，起始位置之前的就是 buffer 字节的初始值，十六进制的 00，显示为：口
 *        - encoding：编码，默认：utf-8
 *        - 返回值：写入的字节数
 *
 *    - 3. 保存并关闭文件
 *      - fs.closeSync(fd)
 *        - fd: 表示文件描述符的整数
 *        - 返回值：undefined
 *
 */

// const fd = fs.openSync('./hello.txt', 'w'); // 打开文件，没有则创建
// fs.writeSync(fd, '要写入的东西'); // 写入内容，清空以前的内容
// fs.closeSync(fd); // 关闭，本地环境测试时，运行完毕就自动关闭了，但是服务器是不会关闭的，会一直存在于内存中，所以这句要写，虽然本地测试写不写都一样

/**
 * 2、文件的异步写入
 *    - fs.open(path[, flags[, mode]], callback)
 *    - fs.write(fd, buffer[, offset[, length[, position]]], callback)
 *    - fs.close(fd[, callback])
 *
 *    > 在 nodejs 中，错误优先，只要一段程序可能会出现异常，那么它的回调函数的第一个参数必然是 err，只有 !err，程序才能继续向下运行
 *
 */

// fs.open('hello_2.txt', 'w', function (err, fd) {
//   if (!err) {
//     console.log('打开文件！');
//
//     fs.write(fd, '这是异步写入的', function (err) {
//       if (!err) {
//         console.log('写入成功！');
//       }
//
//       fs.close(fd, function (err) {
//         if (!err) {
//           console.log('关闭成功！');
//         }
//       });
//     })
//   }
// });

/**
 * 3、简单文件写入（比较常用，对 open、close 等各种 Api 进行了封装）
 *    - fs.writeFile(file, data[, options], callback)
 *      - flag：文件系统标志，a 代表追加，writeFile 的 flag 默认为 w，具体可查官方文档
 *      - \n 换行
 *
 */

// fs.writeFile('hello_3.txt', '使用 writeFile 写入的内容\n', { flag: 'a' }, function (err) {
//   if (!err) {
//     console.log('写入成功！');
//   }
// });

/**
 * 4、使用 appendFile 写入数据（添加的方式）
 *    - appendFile 和 writeFile 的区别只在于默认的 flag 不一样
 *      - appendFile 为 a
 *      - writeFile 为 w
 *      - 事实上，将两个方法的 flag 设置为相同的值，达到的效果是一样的
 */

// fs.appendFile('hello_4.txt', '123', function (err) {
//   if (!err) {
//     console.log('写入成功！');
//   }
// })

/**
 * 5、流式文件写入（同步、异步、简单文件的写入，都不适合大文件的写入，性能较差，容易导致内存溢出）
 *    - fs.createWriteStream(path[, options])
 *      - 可以通过 open 和 close 事件来监听流的打开和关闭（由于打开和关闭只执行一次，所以用 once 来监听）
 *      - 使用 ws.end 结束流，用 ws.close 不能全部流入，可以这么理解：
 *        - 使用 ws.close，相当于把插在目标水池中的管子拔了，但是管子里还有水，还没完全流进去
 *        - 使用 ws.end，相当于把源水池的管子拔了，源水池的水已经输送完毕，剩下的再在管子里慢慢流过去
 *
 */

// 理解：创建一个管子，插到目标池中
const ws = fs.createWriteStream('hello_5.txt');

ws.once('open', function () {
  console.log('流打开了！');
});

ws.once('close', function () {
  console.log('流关闭了！');
});

// 输送水流
ws.write('aaa\n');
ws.write('bbb\n');
ws.write('ccc\n');
ws.write('ddd\n');

ws.end();
