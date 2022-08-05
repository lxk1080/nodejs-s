
/**
 * 说明：自实现 fs 模块中的一些 API
 *    - 自实现的 API 并不是说比原生的好，目的在于熟悉 fs 模块各种 API 的使用
 *    - 在不使用 recursive 的情况下，模拟实现多层目录的创建与删除
 *    - 测试文件：/test/FileLib_test/index.js
 */

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

/**
 * 1、目录创建之同步实现（可以省略 recursive 参数）
 *    - 1. 解决操作系统兼容性问题，将分隔符统一变成 '/'
 *    - 2. 将文件夹分隔开，并且去掉空内容
 *    - 3. 遍历目录，有权限（代表存在）则继续检查下一个目录，没有则创建
 */

const makeDirSync = (dirPath) => {
  const items = dirPath.replace(/\\/g, '/').split('/').filter(Boolean)
  let dir
  for (let i = 1; i <= items.length; i++) {
    dir = items.slice(0, i).join('/')
    try {
      fs.accessSync(dir)
    } catch {
      fs.mkdirSync(dir)
    }
  }
}

/**
 * 2、目录创建之异步实现（可以省略 recursive 参数）
 *    - cbMakeDir 使用 fs 回调的方式实现
 *      - 1. 兼容、拆分、去空
 *      - 2. 由于使用回调的方式（异步的），所以不能用 for 循环，改为使用递归
 *    - makeDir 使用 Promise 的方式实现
 *      - 1. 先将方法变为 promise 类型
 *      - 2. 兼容、拆分、去空
 *      - 3. 使用 async、await，可以使用 for 循环
 */

// 使用 fs 回调的方式
const cbMakeDir = (dirPath, cb) => {
  const items = dirPath.replace(/\\/g, '/').split('/').filter(Boolean)
  let index = 1
  let dir
  function next() {
    if (index > items.length) return cb && cb()
    dir = items.slice(0, index++).join('/')
    fs.access(dir, (err) => {
      if (err) {
        fs.mkdir(dir, next)
      } else {
        next()
      }
    })
  }
  next()
}

// 使用 promise 的方式
const access = promisify(fs.access)
const mkdir = promisify(fs.mkdir)
const makeDir = async (dirPath, cb) => {
  const items = dirPath.replace(/\\/g, '/').split('/').filter(Boolean)
  let dir
  for (let i = 1; i <= items.length; i++) {
    dir = items.slice(0, i).join('/')
    try {
      await access(dir)
    } catch {
      await mkdir(dir)
    }
  }
  cb && cb()
}

/**
 * 3、目录或文件删除之异步实现（目录可以省略 recursive 参数）
 *    > 难点在于理解两个函数间的递归调用
 *    - 1. 判断路径是目录还是文件
 *    - 2. 如果是文件，则直接删除，如果是目录，需要递归删除
 *    - 3. 读出目录内的所有文件夹或文件（是一个数组），并拼成完整路径
 *    - 4. 遍历所有的文件夹或文件，递归使用 removePath。大量使用闭包：filePaths、index、next、cb
 *    - 5. 当遍历标志超过最大索引时，说明内部的文件夹或文件已经删除完，最后删除传入的目录
 */

const removePath = (anyPath, cb) => {
  fs.stat(anyPath, (err, stats) => {
    if (err) return cb(err)
    if (stats.isFile()) {
      fs.unlink(anyPath, cb)
    } else {
      fs.readdir(anyPath, (err, files) => {
        if (err) return cb(err)
        const filePaths = files.map(name => path.join(anyPath, name))
        let index = 0
        function next() {
          if (index === filePaths.length) return fs.rmdir(anyPath, cb)
          const current = filePaths[index++]
          removePath(current, next)
        }
        next()
      })
    }
  })
}

/**
 * 导出
 */

const FileLib = {
  makeDirSync,
  cbMakeDir,
  makeDir,
  removePath,
}

module.exports = FileLib
