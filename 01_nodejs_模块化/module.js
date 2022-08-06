
/**
 * 1、在 node 中，一个 js 文件就是一个模块
 *
 * 2、每一个 js 文件中的 js 代码都是独立运行在一个函数中，不是在全局作用域，所以一个模块中的变量和函数在其他模块中无法访问
 *
 * 3、通过 exports 向外部暴露变量和方法，只需要将暴露给外部的变量或方法设置为 exports 的属性即可，exports 默认为空对象 {}
 *
 */

// exports.x = 10;
// exports.y = 20;

/**
 * 4、node 中有一个全局变量 global，类似于网页中的 window 对象
 *    - 在全局中创建的变量或函数都会作为 global 的属性或方法
 */

// a = 10; // 没有用 var 定义，会提升到最外层，也就是全局
// b = function(){};

// console.log(global.a);
// console.log(global.b);

/**
 * 5、怎么证明代码是运行在函数里面的？
 *    - 使用 arguments，函数所有的参数。arguments.callee，当前执行的函数对象
 *      - 当 node 在执行模块中的代码时，会用下面函数包裹：
 *        - function (exports, require, module, __filename, __dirname) { // 模块代码 }
 *          - exports：
 *            - 该对象用来将变量或函数暴露到外部
 *          - require：
 *            - 函数，用来引入外部的模块
 *          - module：
 *            - 代表是当前的模块本身，exports 就是 module 的属性
 *              - 想要改变 exports 的值，需要写 module.exports = 10; 直接写 exports = 10; 无效，require 的返回值还是空对象 {}，这是由于参数引用的问题（js 基础）
 *          - __filename：
 *            - 当前模块的完整路径
 *          - __dirname：
 *            - 当前模块所在的文件夹路径
 *
 */

// console.log(arguments.callee + ''); // 模块的实际样子
// console.log(exports === module.exports); // true
// console.log(__filename); // C:\Users\lxk\Desktop\Nodejs-s\01_nodejs_模块化\module.js
// console.log(__dirname); // C:\Users\lxk\Desktop\Nodejs-s\01_nodejs_模块化

/**
 * 6、exports 和 module.exports，exports 是函数的参数，是一个变量，默认赋值为 module.exports，require 只接收 module.exports 的值，所以：
 *    - 使用 exports，只能往上面添加属性，exports.x，就相当于 module.exports.x，module.exports 默认为一个空对象 {}
 *    - 改变 exports 的值（exports = x），require 是接收不到的，需要使用 module.exports = x，此时 module.exports 的值由默认的空对象 {} 变成 x
 *    - 一般都使用 module.exports
 */

// exports = 10; // 变量 exports 被重新赋值了，require 的返回值还是 {}
// module.exports = 10; // require 的返回值是 10，就是 module.exports 的值
