
/**
 * 说明：文件可读流详解
 */

const fs = require('fs')

/**
 * 1、创建可读流
 *    - flags：文件系统标志，默认：r
 *    - encoding：字符编码，默认：null，代表 buffer，二进制数据类型（以 16 进制表示）
 *    - fd：文件描述符，默认：null，则自动会以 3 开始，0、1、2 已经提前被标准输入、输出、错误占用了
 *    - mode：文件权限，默认：rw-rw-rw-，八进制 0o666，十进制 438
 *    - autoClose：是否自动关闭文件
 *    - start：文件读取开始位置，单位：字节
 *    - end：文件读取结束位置（包括结束位置）
 *    - highWaterMark：水位线，代表缓冲区最多储存多少容量的数据，单位：字节
 *      - 在 Readable 中默认 16kb
 *      - 在当前的文件可读流中默认 64kb
 */

const rs = fs.createReadStream('./helper/test.txt', {
  flags: 'r',
  encoding: null,
  fd: null,
  mode: 438,
  autoClose: true,
  start: 0,
  end: 9,
  highWaterMark: 3,
})

/**
 * 2、on('data') 流动模式
 *    - 使用 pause() 暂停流动
 *    - 使用 resume() 恢复流动
 */

// rs.on('data', (chunk) => {
//   console.log(chunk.toString())
//   rs.pause()
//   setTimeout(() => {
//     rs.resume()
//   }, 500)
// })

/**
 * 3、on('readable')
 *    - 缓冲区的数据准备好了，可以读了，就会触发 readable 事件，需要调用 read() 方法主动去读
 *    - rs._readableState.length 缓冲区中剩余可读字节的长度
 *    - 流程：
 *      - 可读流向缓冲区存入数据，大小为 highWaterMark 的值，存储完毕触发 readable 事件（从无到有式触发）
 *      - rs 使用 read() 从缓冲区读取数据，每次读取 1 个字节，输出字节和剩余可读字节的长度
 *      - 很快，缓冲区中的数据被消耗完，但 rs 还在读，这时候，可读流再次向缓冲区存入数据
 *      - 当数据存入好后，再次触发 readable 事件，rs 继续从缓冲区读取数据
 *      - 重复上述步骤，直到将来的某个时刻，可读流中全部数据都给了缓冲区，缓冲区中的数据也被消耗完了
 *      - 此时，rs 仍然在喋喋不休的 read() 数据
 *      - 可读流还是像往常一样给缓冲区数据，不知道给了什么，它已经一无所有了，给完了之后依然触发 readable 事件（null式触发）
 *      - rs 又来继续 read() 了，可是这一次，read 的结果为 null
 *      - rs 结束了自己罪恶的一生
 *
 *      > rs 就是可读流，可读流就是 rs，受害者是一开始的数据，rs 丧心病狂将数据大卸八块，然后一口一口吃掉
 *      > 如果 read(size) 方法中，size > highWaterMark
 *        - readable 事件的触发将会变得难以预料，可读流向缓冲区存入数据的大小也会变得难以预料
 *        - 侧面说明：贪心将导致不堪设想的后果
 *
 */

// rs.on('readable', () => {
//   console.log('data-ready-!!!', rs._readableState.length)
//   let data = null
//   while((data = rs.read(1)) !== null) {
//     console.log(data.toString())
//     console.log('------->', rs._readableState.length)
//   }
// })

/**
 * 3、一些常用事件 open、close、end、error
 *    - error 可以通过改成一个不存在的文件名触发
 */

rs.on('error', () => {
  console.log('文件读取出错了')
})

rs.on('open', (fd) => {
  console.log('文件打开了 fd =', fd)
})

let chunks = []
rs.on('data', (chunk) =>{
  chunks.push(chunk)
})

rs.on('end', () => {
  console.log(Buffer.concat(chunks).toString())
  console.log('数据读取完毕了')
})

rs.on('close', () => {
  console.log('文件关闭了')
})
