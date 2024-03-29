
/**
 * 说明：process 相关的属性与方法。process 是全局变量，不需要引入
 */

const events = require('events')
const fs = require('fs')
const path = require('path')
const { sleepTime } = require('../jsIQ/common')

/**
 * 1、资源：CPU、内存
 *
 *    - CPU，用户和系统所占用的 CPU 时间片段，了解一下
 *      - user: 15000
 *      - system: 15000
 *
 *    - 内存，单位：Byte（字节）
 *      - rss: 19202048 是进程在主内存设备（即总分配内存的子集）中占用的空间量，包括所有 C++ 和 JavaScript 对象和代码
 *      - heapTotal: 4931584 当前脚本执行之初所申请的内存
 *      - heapUsed: 4080856 当前脚本执行实际使用的内存大小，可以使用 require('fs') 测试使用内存是否变大
 *      - external: 309830 底层的 C/C++ 模块所占据的内存大小
 *      - arrayBuffers: 11158 初始化的缓冲区大小，可以可用 Buffer.alloc(1000) 去测试缓冲区大小的改变
 *
 */

// console.log(process.cpuUsage()) // cpu 使用信息
// console.log(process.memoryUsage()) // 内存使用信息

/**
 * 2、运行环境：运行目录、node环境、cpu架构、环境变量、系统平台
 */

// console.log(process.cwd()) // 运行目录，指当前 node 进程执行目录，不是文件所在的目录
// console.log(process.version) // v16.15.1，当前的 node 版本
// console.log(process.versions) // 更多的 node 环境信息
// console.log(process.arch) // x64，代表 64 位操作系统
// console.log(process.env) // 环境变量
// console.log(process.env.NODE_PATH) // 通过 npm i xxx -g 安装的包位置
// console.log(process.env.USERPROFILE) // 用户根目录
// console.log(process.platform) // win32，window 平台

/**
 * 3、运行状态：启动参数、进程 PID、运行时间
 *    - process.argv，启动参数
 *      - 是一个数组，默认有两个值，第一个值是 node 启动程序路径，第二个值是当前被执行的文件的路径
 *      - 执行 node xxx.js a 1 2，那么 a 1 2 会按顺序加入到 process.argv 数组中
 *    - process.execArgv，返回启动 Node.js 进程时传递的一组特定于 Node.js 的命令行选项
 *      - 例如：node --harmony ./script.js，注意 --harmony 必须写在 node 执行命令后面
 *
 */

// console.log(process.argv) // 启动参数
// console.log(process.argv0) // 快速拿到数组的第一个值（node启动程序路径），注意不能使用 argv1、argv2、...
// console.log(process.execArgv) // 命令行选项的数组
// console.log(process.pid) // 进程 PID
// console.log(process.ppid) // 当前进程的父进程的 PID
// sleepTime(2000) // 睡两秒
// console.log(process.uptime()) // 当前 Node.js 进程已运行的秒数

/**
 * 4、事件
 *    - 监听进程结束
 *      - beforeExit 回调可以写异步代码，但是会一直循环触发 beforeExit 事件
 *      - exit 回调不可以写异步代码，写了也不会执行
 *      - 可以使用 process.exit() 强制退出当前进程（后面的代码都不会执行了），并且不会触发 beforeExit 事件
 *
 */

// process.on('beforeExit', code => console.log('beforeExit code ==>', code))
// process.on('exit', code => console.log('exit code ==>', code))
// process.exit()
// console.log('执行结束了')

/**
 * 5、标准输入流、输出流
 */

// 1、输入输出流之间的传递
// process.stdout.write('输入点什么：')
// process.stdin.pipe(process.stdout)

// 2、文件流传递
// const filePath = path.resolve(__dirname, '../03_文件系统/data/haha.txt')
// fs.createReadStream(filePath).pipe(process.stdout)

// 3、监听可读，只触发一次
// process.stdout.write('写点什么：')
// process.stdin.on('readable', () => {
//   const chunk = process.stdin.read()
//   if (chunk !== null) {
//     process.stdout.write(`chunk ==> ${chunk}`)
//   }
// })

/**
 * 6、模拟命令行工具
 *    - process.stdin.on('data') 开启输入流的监听，不暂停或退出进程，就会一直监听着
 *    - process.stdin.pause() 暂停输入流录入，可以用 resume() 恢复
 *    - 使用自定义事件通知信息录入完成，并传递数据，做下一步的事情
 *    - 使用时间 3s 模拟安装过程，3s 后完成安装，结束进程
 *
 */

const emitter = new events.EventEmitter()
const eventName = 'stateFinished'

emitter.on(eventName, (data) => {
  console.log('userInfo ==>', data)
  console.log('doSomething...')
  setTimeout(() => {
    console.log('Install Finished ~')
  }, 3000)
})

function execCommand(statements, eventName) {
  const result = {}
  let state
  const opState = () => {
    state = statements.shift()
    process.stdout.write(state.desc)
  }
  opState()
  process.stdin.on('data', (chunk) => {
    if (chunk !== null) {
      result[state.key] = chunk.toString().trim() // chunk 默认是 16 进制，toString 转成字符，trim 是去掉 \r\n
      if (statements.length) {
        opState()
      } else {
        process.stdin.pause() // 暂停，可以用 resume() 恢复
        emitter.emit(eventName, result) // 通知读完了
      }
    }
  })
}

const statements = [
  { key: 'name', desc: '你的名字：' },
  { key: 'age', desc: '你的年龄：' },
  { key: 'birth', desc: '你的生日：' },
]

execCommand(statements, eventName)
