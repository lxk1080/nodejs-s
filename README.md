# nodejs-s

1、nodejs 是单线程的，适合 I/O 密集型任务，但是不适合 CPU 密集型的任务
  - 单线程是指主执行线程是单线程的，其实在 libnv 库里面是有存放着多线程的线程池的
  - 适合 I/O 密集型操作。I/O 操作不是 node 主线程去执行，所以非阻塞式的 I/O，node 执行线程不用等待
  - 不适合 CPU 密集型。大量的计算需要 node 主线程去执行，由于是单线程，所以会造成堵塞，不能充分利用多核 cpu 的计算能力
  - 对于 node 的缺点，事实上也有给出解决方案

2、Buffer 的特点总结
  - 无需 require 的一个全局变量
  - 实现 nodejs 平台下的二进制数据操作
  - 不占据 V8 堆内存大小的独立空间
  - 内存的使用由 node 控制，由 V8 的 GC 回收
  - 一般配合 Stream 流使用，充当数据缓冲区

3、常见的模块化规范
  - `CommonJS` 同步加载，不适合浏览器端
  - `AMD` 异步加载，define、require，代表：require.js
  - `CMD` 异步加载，专为浏览器制作，整合了 CommonJS 和 AMD 的优点，代表：sea.js
  - `ESM` 一般而言是异步加载的

4、在 node 中任意 js 文件都是一个模块，module 属性：`测试文件：/test/module.test.js`
  - id：模块标识符，一般是一个绝对路径
  - filename：文件模块的绝对路径
  - path：文件模块所在目录的绝对路径
  - loaded：布尔值，表示模块是否完成加载
  - parent：对象，存放调用当前模块的模块（已弃用，使用 require.main 和 module.children 代替）
  - children：数组，存放当前模块调用的其他模块
  - exports：当前模块需要暴露的内容
  - paths：数组，加载模块时 node_modules 可能存在的所有位置

5、require 属性：`测试文件：/test/require_test/index.js`
  - resolve：返回模块文件的绝对路径
  - extensions：在 Node 中已有的扩展加载方式（已弃用）
  - main：表示 Node.js 进程启动时加载的入口脚本的 Module 对象
  - cache：缓存的模块
  
6、模块分类及加载流程
  - 模块分类
    - 核心模块：Node 提供的模块
      - 核心模块部分在 Node 源代码的编译过程中，编译进了二进制执行文件
      - 在 Node 进程启动时，部分核心模块就被直接加载进内存中，所以这部分核心模块引入时，文件定位和编译执行这两个步骤可以省略掉，<br>
        并且在路径分析中优先判断，所以它的加载速度是最快的
    - 文件模块：用户编写的模块
      - 文件模块是在运行时动态加载，需要完整的路径分析、文件定位、编译执行过程，速度比核心模块慢
  - 加载流程
    - 优先从缓存加载
      - Node 对引入过的模块都会进行缓存，以减少二次引入时的开销
      - 使用路径做为索引进行缓存，缓存的是编译和执行之后的对象
      - 不论是核心模块还是文件模块，require() 方法对相同模块的二次加载都一律采用缓存优先的方式，这是第一优先级的。<br>
        不同之处在于核心模块的缓存检查先于文件模块的缓存检查
    - 路径分析：依据模块标识符确认模块位置
      - 核心模块（内置模块）
        - 如何加载：在 Node 的源代码编译过程中已经编译为二进制代码
        - 速度：核心模块的优先级仅次于缓存加载。但就加载过程而言，其速度最快
      - 文件模块
        - 如何加载：
          - 以 `.` 、 `..` 和 `/` 开始的标识符，都被当做文件模块来处理
          - 在分析文件模块时，require() 方法会将路径转为真实路径，并以真实路径作为索引，将编译执行后的结果存放到缓存中，以使二次加载时更快
        - 速度：加载速度慢于核心模块
      - 自定义模块
        - 如何加载：在加载的过程中，Node 会逐个尝试模块路径 `module.paths` 中的路径，直到找到目标文件为止
        - 速度：当前文件的路径越深，模块查找耗时会越多，自定义模块的加载速度是最慢的
    - 文件定位：确定模块中具体的文件及文件类型（一个模块中可能含有多个文件）
      - 文件扩展名分析，Node 会按 `.js`、`.json`、`.node` 的次序补足扩展名，依次尝试
      - 目录分析和包
        - require() 通过分析文件扩展名之后，可能没有查找到对应文件，但却得到一个目录，此时 Node 会将目录当做一个包来处理
        - 首先，Node 在当前目录下查找 package.json，通过 JSON.parse() 解析出包描述对象，从中取出main属性指定的文件名进行定位。<br>
          如果文件名缺少扩展名，将会进入扩展名分析的步骤
        - 如果 main 属性指定的文件名错误，或者压根没有 package.json 文件，Node 会将 index 当做默认文件名，然后依次查找 index.js、index.json、index.node
        - 如果在目录分析的过程中没有定位成功任何文件，则自定义模块进入下一个模块路径进行查找。<br>
          如果模块路径数组都被遍历完毕，依然没有查找到目标文件，则会抛出查找失败的异常
    - 编译执行：采用对应的方式完成文件的编译执行
      - 这里说的模块编译都是指文件模块，即用户自己编写的模块
      - 定位到具体的文件后，Node 会新建一个模块对象，然后根据路径载入文件并编译。对于不同的文件扩展名，其载入方法也有所不同（根据 require.extensions）
        - `.js` 文件，通过 fs 模块 `同步` 读取文件后编译执行
          - 在编译的过程中，Node 对获取的 JS 文件内容进行了头尾包装，<br>
            在头部添加了 `(function (exports, require, module, __filename, __dirname) { `，<br>
            在尾部添加了 `\n});`
          - 通过 vm 原生模块的 runInThisContext() 方法执行，返回一个具体的 function 对象
          - 将当前模块对象的 exports、require、module，以及在文件定位中得到的 __filename 和 __dirname 作为参数传递给这个 function() 执行
          - 执行之后，模块的 exports 属性被返回给了调用方
        - `.json` 文件，通过 fs 模块同步读取文件后，用 JSON.parse() 解析返回结果
          - Node 利用 fs 模块同步读取 JSON 文件的内容之后，调用 JSON.parse() 方法得到对象，然后将它赋给模块对象的 exports，以供外部调用
          - .json 文件的编译是 3 种编译方式中最简单的
        - `.node` 文件，这是用 C/C++ 编写的扩展文件，通过 process.dlopen() 方法加载最后编译生成的文件
          - .node 的模块文件并不需要编译，因为它是编写 C/C++ 模块之后编译生成的，所以只有加载和执行的过程，<br>
            在执行的过程中，模块的 exports 对象与 .node 模块产生联系，然后返回给调用者
          - dlopen() 方法在 Windows 和 *nix 平台下分别有不同的实现，通过 libuv 兼容层进行了封装
          - C/C++ 模块给 Node 使用者带来的优势主要是执行效率方面的，劣势则是 C/C++ 模块的编写门槛比 JavaScript 高
        - 其余扩展名文件，它们都被当做 .js 文件载入

7、模块加载源码分析，可以参考：[这个视频](https://www.bilibili.com/video/BV1sA41137qw?p=33&vd_source=35be3e17bbdc37153857a5a71c39543a)
  - 以 `.js` 文件为例，加载过程关键步骤
    ```js
    - `require('./xxx);`
    - `return mod.require(path);`
    - `return Module._load(id, this, /* isMain */ false);`
    - `module.load(filename);`
    - `Module._extensions[extension](this, filename);`
    - `module._compile(content, filename);`
      - `const compiledWrapper = wrapSafe(filename, content, this);`
      - `result = ReflectApply(compiledWrapper, thisValue, [exports, require, module, filename, dirname]);`
    ```

8、模块加载模拟实现：`参考文件：/01_nodejs_模块化/01_myRequire.js`

9、EventEmitter 源码解析，可以参考：[这个视频](https://www.bilibili.com/video/BV1sA41137qw?p=39&vd_source=35be3e17bbdc37153857a5a71c39543a)

10、Node 中的事件循环：`测试文件：/test/EventLoop_test/index.js`
  - 官方指南：[event-loop-timers-and-nexttick](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)
  - 阶段概述（每个阶段都有一个 FIFO 队列来执行回调。以下排列顺序就是队列执行的先后顺序）
    - `timers`：执行 setTimeout 和 setInterval 回调
    - `pending callbacks`：执行在上一轮循环中被延迟的 I/O 回调 + 系统操作回调（如 TCP 错误类型）
    - `idle, prepare`：只在系统内部进行使用
    - `poll`：执行与 I/O 相关的回调（这个阶段最为复杂，可参考官方指南）
    - `check`：执行 setImmediate 的回调
    - `close callbacks`：执行 close 事件的回调
  - 事件循环（简单理解）
    - 执行同步代码，将不同的任务添加至相应的队列
    - 所有同步代码执行完后，会去执行满足条件的微任务，微任务有优先级（事实上在 Node 里面没有微任务的概念，这里为了便于理解，就叫微任务）
      - process.nextTick > Promise
    - 所有微任务执行完后，会按照上面 `事件队列` 的顺序依次切换队列执行
    - 注意：每执行完成一个宏任务后，会先去检查是否有微任务，如果有，则先去执行完所有的微任务，再去执行宏任务。原理同浏览器一样
      - 顺便一提：在低版本的 Node 中，是每次做切换队列之前，去检查微任务的，现在最新版的是每执行完一个宏任务后去检查，和浏览器保持一样了，<br>
        大概是从 12.x.x 版本开始改的
  - 关于 setImmediate
    - setImmediate 是一个在事件循环的单独阶段运行的特殊计时器。它使用一个 libuv API 来安排回调在 轮询（poll） 阶段完成后执行
    - setImmediate 相对于 setTimeout 的主要优势是：如果 setImmediate 是在 I/O 周期内被调度的，那它将会在其中任何的定时器之前执行
  - 关于 process.nextTick
    - 虽然 process.nextTick 是异步 API 的一部分，但是从技术上来讲，它并不是事件循环的一部分
    - 执行时机：在每次同步代码执行之后，都会第一时间执行（也就是微任务的执行时机）
      - 如果 process.nextTick 进行递归调用，将会阻塞事件循环
  - 与浏览器中事件循环的不同点
    - 任务队列数不同
      - 浏览器中只有两个任务队列，微任务队列和宏任务队列
      - 在 Node 中抛开微任务队列，还有其他的 6 个事件队列，且有执行顺序
    - 微任务优先级不同
      - 浏览器中，微任务事件队列，先进先出
      - 在 Node 中微任务执行存在优先级
  - 需要注意的地方，`测试文件：/test/EventLoop_test/01_timerAndCheck.js`
    - setTimeout 与 setImmediate 的执行先后顺序是不确定的

      ```js
        // 下面代码执行，有时先输出 timer，有时先输出 immerdiate
        // 是因为 setTimeout 是有随机延时的，在进行事件循环时，也许其回调函数还没有加入到 timer 队列，所以先执行 setImmediate
      
        setTimeout(() => {
          console.log('timer')
        })
    
        setImmediate(() => {
          console.log('immerdiate')
        })
      ```

    - 与 I/O 操作一起使用时，setTimeout 与 setImmediate 的执行先后顺序是固定的
    
      ```js
        // 下面代码执行，固定先输出 immerdiate，后输出 timer
        // 是因为 I/O 操作放在 poll 队列，其回调执行完成后，将 setTimeout 回调加入 timer，将 setImmediate 回调加入 check
        // poll 执行完成后，紧接着执行 check 队列，刚好可以执行刚加入的 immerdiate 回调，所以 immerdiate 每次都会先输出
        // timer 的输出在下一次事件循环中
      
        const fs = require('fs')

        fs.readFile('./index.js', () => {
          setTimeout(() => {
            console.log('timer')
          })
    
          setImmediate(() => {
            console.log('immerdiate')
          })
        })
      ```

11、Node 中的流操作 Stream
  - 主要应用场景
    - 文件操作系统
    - 网络模块
  - 流处理数据的优势
    - 时间效率：流的分段处理可以同时操作多个数据 chunk。用户无需等待
    - 空间效率：同一时间，流无需占据大内存空间。防止内存溢出
    - 使用方便：流配合管理，扩展程序变得简单。在中间环节处理数据
  - 流的分类
    - Readable：可读流，实现数据的读取
    - Writeable：可写流，实现数据的写操作
    - Duplux：双工流，既可读又可写
    - Transform：转换流，可读可写，还能实现数据转换
  - 流的特点
    - 以上的四个都是具体的抽象，也就是类，使用需要自行实现抽象接口
      - 一般情况下我们不需要直接使用，像 fs、http 这样的模块都有实现相应的接口
    - 所有流都继承自 EventEmitter
  - 可读流：用来生产数据的流
    - 自定义可读流：`参照文件：/05_stream/01_MyReadable.js`
  - 可写流：用来消费数据的流
    - 自定义可写流：`参照文件：/05_stream/02_MyWritable.js`
  - 双工流：既能生产，又能消费，两者独立
    - 自定义双工流：`参照文件：/05_stream/03_MyDuplex.js`
  - 转换流：既能生产，又能消费，两者联接
    - 自定义转换流：`参照文件：/05_stream/04_MyTransform.js`

98、文件权限位

![png](https://article.biliimg.com/bfs/article/abc30455c030a935bbd79955fdb881912d392c22.png)

99、文件系统标志
  - `'a'` 打开文件进行追加。如果文件不存在，则创建该文件
  - `'ax'` 类似于 'a'，但如果路径存在则失败
  - `'a+'` 打开文件进行读取和追加。如果文件不存在，则创建该文件
  - `'ax+'` 类似于 'a+'，但如果路径存在则失败
  - `'as'` 打开文件以同步模式追加。如果文件不存在，则创建该文件
  - `'as+'` 以同步模式打开文件进行读取和追加。如果文件不存在，则创建该文件
  - `'r'` 打开文件进行读取。如果文件不存在，则会抛出异常
  - `'r+'` 打开文件进行读写。如果文件不存在，则会抛出异常
  - `'rs+'` 以同步方式打开文件进行读写。指示操作系统绕过本地文件系统缓存
  - `'w'` 打开文件进行写入。如果文件不存在，则创建该文件，如果存在，则被截断（清空内容重新写入）
  - `'wx'` 类似于 'w'，但如果路径存在则失败
  - `'w+'` 打开文件进行读写。该文件被创建（如果它不存在）或被截断（如果它存在）
  - `'wx+'` 类似于 'w+'，但如果路径存在则失败

100、其他
  - 在 Node 模块中，this 指向默认的 module.exports 对象

<br><br><br>
