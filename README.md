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

3、权限位

![png](https://article.biliimg.com/bfs/article/abc30455c030a935bbd79955fdb881912d392c22.png)

4、
