
/**
 * 说明：关于 path 模块的一些常用方法
 *
 */

const path = require('path');

// 定义一个路径形式的公用字符串
const pathString = 'D:/a/b/c/index.js';

/**
 * 1、basename
 *    - 1. 正常情况下就是文件名
 *    - 2. 如果没有文件名，返回最后一层路径名
 *    - 3. 可以输入第二个参数，省略输入的字符
 *
 */

// console.log('basename:', path.basename(pathString)); // index.js
// console.log('basename:', path.basename(pathString, '.js')); // index
// console.log('basename:', path.basename(pathString, 'x.js')); // inde
// console.log('basename:', path.basename('D:/a/b/c/')); // c

/**
 * 2、extname 扩展名
 * 
 */

// console.log('extname:', path.extname(pathString)); // .js

/**
 * 3、dirname 文件夹
 * 
 */

// console.log('dirname:', path.dirname(pathString)); // D:/a/b/c

/**
 * 4、isAbsolute 是否是绝对路径
 * 
 */

// console.log('isAbsolute:', path.isAbsolute(pathString)); // true

/**
 * 5、parse 路径解析
 *
 */

// console.log('parse:', path.parse(pathString)); // 返回一个对象

/**
 * 6、join 拼接路径（不一定是绝对路径，如果第一个参数为 __dirname，则会拼接成一个新的绝对路径）
 *    - 简单的拼接，除了 '.' '..' 会认为是操作路径外，其他的都是纯粹的拼接，并且会去掉多余的点或斜杆
 *
 */

// console.log('join:', path.join(pathString, '/qq/ww/ee', 'rr/tt')); // D:\a\b\c\index.js\qq\ww\ee\rr\tt
// console.log('join:', path.join(pathString, '/qq/ww/ee', 'rr/tt', '..')); // D:\a\b\c\index.js\qq\ww\ee\rr\
// console.log('join:', path.join('/qq/ww/ee', 'rr/tt')); // \qq\ww\ee\rr\tt
// console.log('join:', path.join('qq', 'ww')); // qq\ww

/**
 * 7、resolve 解析为绝对路径（一定是绝对路径）
 *    - 不是简单的拼接，万变不离其宗之原理：想象在输入命令行，当前的路径是执行 node 命令的终端路径，每个参数依次使用 cd 指令，结果和在命令行切换路径的效果相同
 *    - 根据 cd 命令行的理解：
 *      - 只要参数的第一个字符是：/ ，相当于：cd / ，就会切换到根路径（注意：在 window 中，'X:/' 同理）
 *      - 如果解析的参数中，没有根路径，则会在前面拼接上执行当前文件的 node 命令所在的终端路径
 *    - 在 window 中，可以单独的切换盘符，而不改变后面的路径
 *
 */

console.log('resolve:', path.resolve(pathString, './qq', '/uu/oo', './pp', 'uioop', '../mm')); // D:\uu\oo\pp\mm
console.log('resolve:', path.resolve('qq', 'ww')); // D:\ZCODE\Nodejs-s\10_others\qq\ww
console.log('resolve:', path.resolve('qq', '/ww')); // D:\ww
console.log('resolve:', path.resolve('qq', '/ww/ee', 'C:/')); // C:\
console.log('resolve:', path.resolve('qq', '/ww/ee', 'C:')); // C:\ww\ee

/**
 * plus：
 *  - 1、文件操作中的相对路径，例如：'./hello.js'，相对的不是那个执行文件，而是执行 node 命令所处的终端路径
 *    - 所以相对路径是不靠谱的，在使用 join 和 resolve 方法时，一般都会配合 __dirname 来动态获取当前文件所在文件夹的绝对路径
 *    - 注意：模块中的路径标识和文件操作中的相对路径没有关系，模块中的路径标识就是相对于当前文件模块本身的
 *
 */
