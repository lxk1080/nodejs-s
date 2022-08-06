
/**
 * 模块 module 下的属性
 *   - id：模块标识符，一般是一个绝对路径
 *   - filename：文件模块的绝对路径
 *   - path：文件模块所在目录的绝对路径
 *   - loaded：布尔值，表示模块是否完成加载
 *   - parent：对象，存放调用当前模块的模块
 *   - children：数组，存放当前模块调用的其他模块
 *   - exports：当前模块需要暴露的内容
 *   - paths：数组，加载模块时 node_modules 可能存在的所有位置
 */

console.log(module)
