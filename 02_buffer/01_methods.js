
/**
 * 说明：buffer 的部分实例方法与静态方法
 *    - 直接通过 Buffer.xxx 调用的是静态方法，其他的都是实例方法（虽然显而易见，还是说明下）
 */

/**
 * 1、fill 填充
 *    - 填充规则：多退少补，重复填充，直到填满
 *    - 第 2、3 个参数，例如下面的参数 3、5
 *      - [3, 5) 从 Buffer 索引的第 3 个开始，第 5 个之前结束（不包括第 5 个）
 *    - 可以填充数字，十进制的数字 123，转化为 16 进制为 7b，对应的是 utf-8 编码的 {
 *    - 重复的 fill 会覆盖之前的 fill
 */

// const buf = Buffer.alloc(6)
// buf.fill('123')
// buf.fill('1234')
// buf.fill('12345678')
// buf.fill('123', 3, 5)
// buf.fill(123)
// buf.fill('4')
// console.log(buf)
// console.log(buf.toString('utf-8'))

/**
 * 2、write 写入
 *    - 填充规则：多退，少不补，不会重复
 *    - 第 2、3 个参数，例如下面的参数 1、2
 *      - 从 Buffer 索引的第 1 个开始，长度为 2
 *    - 不可以填充数字，只能写字符串
 *    - 重复的 write，只覆盖对应索引处的字节
 */

// const buf = Buffer.alloc(6)
// buf.write('123')
// buf.write('12345678')
// buf.write('123', 1, 2)
// buf.write(123) // error
// buf.write('4')
// console.log(buf)
// console.log(buf.toString())

/**
 * 3、toString
 *    - 默认使用的是 utf-8 编码
 */

// const buf = Buffer.from('我爱学习')
// console.log(buf)
// console.log(buf.toString('utf-8'))
// console.log(buf.toString('utf-8', 1)) // 会转成 ?，注意一个汉字占 3 个字节
// console.log(buf.toString('utf-8', 3))
// console.log(buf.toString('utf-8', 3, 9))

/**
 * 4、slice
 *    - 和数组的 slice 方法类似，返回新的 buffer
 */

// const buf = Buffer.from('我爱学习')
// const sliceBuf = buf.slice()
// const sliceBuf = buf.slice(3, 9)
// const sliceBuf = buf.slice(-6)
// console.log(sliceBuf === buf)
// console.log(sliceBuf.toString())

/**
 * 5、indexOf
 */

// const buf = Buffer.from('我爱学习，爱前端，爱代码')
// console.log(buf.indexOf('爱')) // 返回索引 3
// console.log(buf.indexOf('爱', 4)) // 返回索引 15，从第 4 位开始找，中文的逗号也占 3 个字节
// console.log(buf.indexOf('爱QQ')) // 返回 -1，表示找不到，和 js 的差不多

/**
 * 6、copy
 *    - 以下面代码为例
 *      - b2.copy(b1)，b2 是源数据，b1 是目标数据，将 b2 拷贝到 b1
 *      - 参数 2：目标数据，从第几个字节开始承装数据
 *      - 参数 3：源数据，从第几个字节开始复制
 *      - 参数 4：源数据，在第几个字节之前复制结束（不包括索引 9）
 */

// const b1 = Buffer.alloc(12)
// const b2 = Buffer.from('我爱学习')
// b2.copy(b1)
// b2.copy(b1, 3, 3, 9)
// console.log(b1)
// console.log(b1.toString())

/**
 * 7、concat
 *    - 参数 2：可以指定联接之后的字节长度
 */

// const b1 = Buffer.from('我爱')
// const b2 = Buffer.from('学习')
// const buf = Buffer.concat([b1, b2])
// const buf = Buffer.concat([b1, b2], 9)
// console.log(buf)
// console.log(buf.toString())

/**
 * 8、isBuffer 是否是个 buffer 数据
 */

// console.log(Buffer.isBuffer(Buffer.from('我爱学习')))
// console.log(Buffer.isBuffer(123))
// console.log(Buffer.isBuffer('abc'))

/**
 * 9、byteLength 字符串转化为 buffer 后的字节长度，参数不能为数字
 */

console.log(Buffer.byteLength('我爱学习')) // 12
console.log(Buffer.byteLength('123')) // 3
