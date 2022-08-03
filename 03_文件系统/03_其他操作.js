
/**
 * 说明：以下所有方法，除了特别注明，都存在同步和异步两种方式
 *
 */

const fs = require('fs');

/**
 * 1、判断文件是否存在
 *    - fs.existsSync(path)
 *      - 判断文件是否存在是个立即的操作，所以同步，异步的方法已经被弃用了
 *
 */

// const has = fs.existsSync('./data/haha.txt');
// console.log(has); // true

/**
 * 2、获取文件的状态
 *    - fs.stat(path[, options], callback)
 *      - 回调函数的第二个参数是一个 stats 对象，可以用来判断是否是一个文件、文件夹等等，具体查阅官方文档
 *
 */

// fs.stat('./data', function (err, stats) {
//   if (!err) {
//     console.log('isFile:', stats.isFile());
//     console.log('isDirectory:', stats.isDirectory());
//   }
// });

/**
 * 3、删除文件（只能用来删除文件，不能删除文件夹）
 *    - fs.unlink(path, callback)
 *
 */

// fs.unlink('./haha/test.js', function (err) {
//   if (!err) {
//     console.log('删除成功！');
//   }
// });

/**
 * 4、读取目录
 *    - fs.readdir(path[, options], callback)
 *      - 回调函数中 files 是一个装有文件名或文件夹名字符串的数组，只有第一层，内部文件夹内的文件不会展示
 *
 */

// fs.readdir('./data', function (err, files) {
//   if (!err) {
//     console.log(files);
//   }
// });

/**
 * 5、创建目录与删除目录（在未来的 node 版本，删除文件和文件夹将会共用同一个方法 fs.rm）
 *    - fs.mkdir(path[, options], callback)
 *      - 默认只会创建一层目录，如果想创建多层目录，需要使用 recursive 属性（使用递归），否则会报错
 *    - fs.rmdir(path[, options], callback)
 *      - 默认只会删除空目录，如果想删除非空目录，同样需要使用 recursive 属性（使用递归），否则会报错
 *
 */

// fs.mkdir('./custom', function (err) {
//   if (!err) console.log('创建完成！');
// });

// fs.mkdir('./a/b/custom', { recursive: true }, function (err) {
//   if (err) return console.log(err);
//   console.log('创建完成！');
// });

// fs.rmdir('./custom',  function (err) {
//   if (!err) console.log('目录已删除！');
// });

// fs.rmdir('./a', { recursive: true }, function (err) {
//   if (err) return console.log(err);
//   console.log('目录已删除！');
// });

/**
 * 6、重命名（文件和目录都可以重命名）
 *    - fs.rename(oldPath, newPath, callback)
 *      - oldPath 和 newPath 中文件所在的目录不同，就相当于剪切功能
 *
 */

// fs.rename('./haha/one.js', './haha/two.js', function (err) {
//   if (!err) console.log('重命名完成！');
// });

/**
 * 7、复制文件（不能复制文件夹）
 *    - fs.copyFile(src, dest[, mode], callback)
 *
 */

// fs.copyFile('./haha/target.js', './target.js', function (err) {
//   if (!err) console.log('复制完成!');
// });

/**
 * 8、监听文件
 *    - fs.watchFile(filename[, options], listener)
 *      - listener 中有两个参数，cur 和 prev，分别代表当前文件（修改后）和修改之前的 stats 对象
 *      - 对应的方法是 fs.unwatchFile
 *
 */

// fs.watchFile('./data/watchedFile.txt', { interval: 1000 }, function (cur, prev) {
//   console.log('修改前：', prev.size);
//   console.log('当前文件：', cur.size);
// });

/**
 * 9、文件权限
 *    - 可以用来判断文件是否存在，如果有操作权限，则证明存在，否则不存在（或者存在但是没权限，这个目前不清楚，需要去解析 err 信息）
 */

fs.access('./data/haha.txt', (err) => {
  if (err) return console.log(err)
  console.log('有操作权限')
})
