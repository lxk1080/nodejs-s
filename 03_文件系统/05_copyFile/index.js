
/**
 * 说明：通过 buffer 缓冲区复制文件
 *    - 测试文件：/test/copyFile_test/index.js
 */

const fs = require('fs')

/**
 * 1、创建一个 buffer 用来缓冲数据
 * 2、先打开源文件和目标文件
 * 3、定义一个函数，里面写上读数据和写数据的操作。函数第一次立即执行
 * 4、通过判断读出来的数据长度判断是否读完
 * 5、如果读完，则复制完成，关闭文件，执行回调
 * 6、如果没有读完，则重复函数内的读写操作
 */

const myCopyFile = (originFile, targetFile, callback) => {
  const buf = Buffer.alloc(10) // 创建 buffer 缓冲数据
  let position = 0 // 从哪个位置开始读文件

  // 打开源文件
  fs.open(originFile, 'r', (err, rfd) => {
    if (err) return callback(err)
    // 打开目标文件
    fs.open(targetFile, 'w', (err, wfd) => {
      if (err) return callback(err)
      // 定义函数，里面做读写的操作
      function next() {
        // 源文件读数据放入 buffer
        fs.read(rfd, buf, 0, buf.length, position, (err, readBytes) => {
          if (err) return callback(err)
          // 读出来的数据长度为 0，说明读完了
          if (readBytes === 0) {
            fs.close(rfd)
            fs.close(wfd)
            callback()
            return
          }
          // 从 buffer 拿数据写到目标文件，拿多少？就拿刚才读到的数据长度
          // 第 5 个参数是从目标文件哪个位置开始写，不用传，默认是接着后面写
          fs.write(wfd, buf, 0, readBytes, (err, writeBytes) => {
            if (err) return callback(err)
            position += writeBytes // 下一次读的位置
            next() // 继续读写
          })
        })
      }
      // 第一次立即执行
      next()
    })
  })
}

module.exports = myCopyFile
