
/**
 * 1、Buffer（缓冲区），结构和数组很像，操作方法也和数组类似
 *    - 数组中不能存储二进制的文件，而 buffer 就是专门用来存储二进制数据的
 *    - 在 buffer 中存储的都是二进制数据，但是以 16 进制的形式显示（二进制显示太长了）
 *
 * 2、buffer 中每一个元素的范围：
 *    - 16 进制：00 ~ ff
 *    - 10 进制：0 ~ 255
 *    - 2 进制：00000000 ~ 11111111
 *
 *    > 也就是一个字节的范围，1 Byte = 8 bit，一个字节由 8 位组成，每位上是 0 或 1
 *    > 顺便一提：计算机中最小的内存计算单位是 byte
 *
 * 3、buffer 的大小一旦确定，则不能修改，buffer 实际上是对底层内存的直接操作，buffer 里面的空间都是连续的
 *    - 原因：创建了一个 buffer 后，如果给超出最大索引的位置赋值，这个位置可能被其他数据占用，那么这个数据可能存储在一个不连续的空间里，不易于维护，性能差
 *
 * 4、输出一个字节 console.log(buf[0]); 输出的结果一定是十进制的
 *    - 主要是为了防止 buffer 中各种进制输入数据鱼龙混杂，不便于计算（例如：buf[0] = 10; buf[1] = 0x88; buf[2] = 066;）
 *    - 想要输出其他进制可以这么写：console.log(buf[0].toString(16));
 *    - 使用 buf.toString() 可以输出原本的数据
 *
 * 5、关于 alloc 和 allocUnsafe
 *    - 两个方法用法是一样的
 *    - alloc 分配空间的同时，会清空掉以前在此空间的数据，并以 0 填充
 *    - allocUnsafe 分配空间，直接把这个空间拿过来，不做任何操作，里面内容未知，可能包含敏感数据
 *    - alloc 由于做了清空填充操作，所以比 allocUnsafe 的性能要差
 *
 * 6、buffer 的特点总结
 *    - 无需 require 的一个全局变量
 *    - 实现 nodejs 平台下的二进制数据操作
 *    - 不占据 V8 堆内存大小的独立空间
 *    - 内存的使用由 node 控制，由 V8 的 GC 回收
 *    - 一般配合 Stream 流使用，充当数据缓冲区
 *
 */

/**
 * test 01
 */

// const str1 = 'hello node';
// const str2 = 'hello 世界';
// const buf1 = Buffer.from(str1);
// const buf2 = Buffer.from(str2);
// console.log(buf1.length); // 占用内存的大小 = 10，单位为：byte
// console.log(buf2.length); // 占用内存的大小 = 12 = 6 + 2 * 3，一个汉字占用 3 个字节

/**
 * test 02
 */

// const buf3 = Buffer.alloc(10); // 分配 10 个字节的大小
// buf3[0] = 88; // 十进制转换成十六进制为：58
// buf3[1] = 255; // ff
// buf3[2] = 0xaa; // 0x 开头表示十六进制数字
// buf3[3] = 256; // 对应的二进制：100000000，1 后面 8 个 0，1 个字节最多 8 位，从右往左数 8 位放到内存，剩下的位不要了，所以结果是：0
// buf3[4] = 556; // 同理，对应的二进制：1000101100，后 8 位是：00101100，转换为十六进制是：2c，十进制是：44
// buf3[10] = 10; // 无效，buffer 的大小为 10，最大索引为 9，给索引 10 赋值，不会有任何改变，参考笔记第 3 项

// console.log(buf3); // 输出的是 buffer 数组，里面装的是十六进制的数据，每一个数据占用一个字节
// console.log(buf3[4]); // 具体的值在控制台或页面输出的是十进制：44，不是十六进制 2c 了，参考笔记第 4 项

/**
 * test 03
 */

// const buf4 = Buffer.from('我是一段数据');
// console.log(buf4.toString()); // 使用 toString 方法，输出原本的数据

/**
 * 两个变量不会共用同一个 buffer 空间
 */

const b1 = Buffer.alloc(5)
const b2 = Buffer.from(b1)
b1[0] = 3
console.log(b1)
console.log(b2)
