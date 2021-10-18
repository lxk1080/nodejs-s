
/**
 * 1、在 node 中，通过 require 函数来引入外部的模块，require 可以传递一个文件的路径作为参数，路径如果使用相对路径，必须以 . 或 .. 开头
 *
 * 2、通过 require 引入模块以后，该函数会返回一个对象，这个对象代表的就是引入的模块（exports 的值）
 *
 * 3、使用 require 引入外部模块时，使用的就是模块标识（require 的参数），通过模块标识来找到指定的模块
 *    - 模块分为两大类
 *      - 核心模块：由 node 引擎提供的模块，模块标识就是模块的名字
 *      - 文件模块：由用户自己创建的模块，模块标识就是文件的路径，可以用绝对路径或相对路径，相对路径要使用 . 或 .. 开头
 *
 *
 */

// const num = require('./module');

// console.log(num);

/**
 * 4、node 在使用模块名字来引用模块时，它会首先在当前目录的 node_modules 中寻找是否有该模块，
 *    如果有则直接使用，如果没有，则去上一级目录的 node_modules 中寻找，
 *    如果有则直接使用，如果没有，则再去上一级目录寻找，逐级向上，一直到磁盘的根目录（类似于 js 的作用域），
 *    如果在磁盘的根目录依然没有，则会去全局模块中去找，
 *    如果还没有的话，则报错
 *
 */

// const math = require('math');

// console.log(math.add(1, 2));
