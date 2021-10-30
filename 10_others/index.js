
/**
 * 说明：常用的一些模块及方法汇总
 *
 */



/**
 * 1、URL 类，用来解析 url 的，返回一个对象，包含：host、pathname、search ... 等数据
 *
 *    > url.parse 方法已经被弃用
 *
 */

// const urlObj = new URL('http://loveocat.com/music?name=haha&num=123');
// console.log(urlObj);
// console.log(urlObj.searchParams.get('name'));
// console.log(urlObj.searchParams.get('num'));



/**
 * plus、学到一个知识点，将特定的对象转化为数组，可以使用 slice 方法
 *    - 可以转化的关键在于：
 *      - 1. 对象的索引必须是 0、1、2、3 ... 按顺序排列
 *      - 2. 要有 length 属性
 *
 */

const a = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};

console.log(Array.prototype.slice.call(a)); // ['a', 'b', 'c']

/**
 * 下面的模拟一下 slice 方法的实现
 *
 */

Array.prototype.mySlice = function () {
  let start = 0;
  let end = this.length;
  if (arguments.length === 1) {
    start = arguments[0];
  }
  if (arguments.length === 2) {
    start = arguments[0];
    end = arguments[1];
  }
  const tmpArr = [];
  for (let i = start; i < end; i++) {
    tmpArr.push(this[i]);
  }
  return tmpArr;
};

// 测试下
console.log(Array.prototype.mySlice.call(a)); // ['a', 'b', 'c']
