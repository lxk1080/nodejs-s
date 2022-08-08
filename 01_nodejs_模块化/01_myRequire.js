
/**
 * 说明：模块加载模拟实现
 *    - 测试文件：/test/myRequire_test/index.js
 *    - 简单实现，只处理 .js、.json 扩展名，不解析路径是目录或包的情况
 *    - 目标模块的路径解析，应该是相对于父模块的，这里简单实现，都相对于 Node 启动路径
 *    - 模拟 require 的步骤
 *        1. 路径分析 + 文件定位，获取要加载模块的绝对路径
 *        2. 缓存优先，如果有，则直接返回
 *        3. 没有缓存则新建一个 module 对象
 *        4. 缓存 module 对象
 *        5. 加载 module 并编译执行（通过 module 的绝对路径读取文件）
 *        6. 返回 module.exports
 */

const fs = require('fs')
const path = require('path')
const vm = require('vm')

function Module (id) {
  this.id = id
  this.exports = {}
}

// 实例方法
Module.prototype.load = function () {
  const extname = path.extname(this.id)
  Module._extensions[extname](this)
}

// 模块缓存空间
Module._cache = {}

Module.wrapper = [
  '(function (exports, myRequire, module, __filename, __dirname) { ',
  '\n});',
]

Module._extensions = {
  '.js': function (module) {
    // 1、读取内容
    let script = fs.readFileSync(module.id, 'utf-8')
    // 2、包裹内容
    script = Module.wrapper[0] + script + Module.wrapper[1]
    // 3、编译成可执行的函数
    const compileFn = vm.runInThisContext(script)
    // 4、准备参数
    const exports = module.exports
    const filename = module.id
    const dirname = path.dirname(filename)
    // 5、执行函数，this 指向 exports
    compileFn.apply(exports, [exports, myRequire, module, filename, dirname])
  },
  '.json': function (module) {
    // 1、读取内容
    const content = fs.readFileSync(module.id, 'utf-8')
    // 2、将内容 JSON.parse 后直接输出
    module.exports = JSON.parse(content)
  }
}

Module._resolveFilename = function (moduleFlag) {
  // 这个地方的路径，应该是相对于源文件的，这里简单模拟，都相对于 Node 启动路径
  const absPath = path.resolve(moduleFlag)
  // 存在路径直接返回
  if (fs.existsSync(absPath)) {
    return absPath
  } else {
    // 遍历扩展名，如果存在则返回
    const suffix = Object.keys(Module._extensions)
    for (let i = 0; i < suffix.length; i++) {
      const newPath = absPath + suffix[i]
      if (fs.existsSync(newPath)) {
        return newPath
      }
    }
  }
  // 最终找不到，则抛出错误
  throw new Error(`${moduleFlag} is not exists`)
}

const myRequire = (moduleFlag) => {
  // 1、路径分析 + 文件定位，解析为绝对路径
  const modulePath = Module._resolveFilename(moduleFlag)
  // 2、缓存优先
  const cacheModule = Module._cache[modulePath]
  if (cacheModule) return cacheModule.exports
  // 3、没有缓存，则新建一个 module
  const module = new Module(modulePath)
  // 4、缓存 module
  Module._cache[modulePath] = module
  // 5、加载模块内容，同步的过程
  module.load(module)
  // 6、返回 exports
  return module.exports
}

module.exports = myRequire
