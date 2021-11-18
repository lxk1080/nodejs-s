
/**
 * ## 关于 mongoDB
 *
 * 1、mongoDB，noSQL，not only SQL，非关系型数据库
 *    - 操作数据时，不需要事先创建数据库和设计表结构（集合）
 *    - 不过一般情况下，还是会先设计集合结构（毕竟不能乱写，虽然 mongoDB 很灵活）
 *
 * 2、连接数据库：`mongo`，连接的是本地的 mongoDB 数据库
 *
 * 3、基本命令：
 *    - show dbs（显示所有的数据库）
 *    - use <数据库名称>（切换到指定的数据库，如果没有则创建）
 *    - db（查看当前操作的数据库）
 *    - db.students.insertOne(['name', 'Jack'])
 *      - 这句的意思是：在当前数据库中新建一个集合 students，并插入一条数据
 *      - 非关系型数据库，不需要在事先创建表结构，就可以直接操作数据
 *    - show collections（显示所有的集合）
 *    - db.students.find()
 *      - 这句的意思：显示 students 集合中所有的数据
 *
 * 4、基本概念：
 *    - 数据库：对应 mysql 的数据库
 *    - 集合：对应 mysql 的表，在 mongoDB 中，是一个数组
 *    - 文档：对应 mysql 的表记录，指的是集合中的每一条数据，是一个对象
 *
 */

/**
 * ## mongoDB 的使用
 *
 */

/**
 * 1、引入 mongoose 库，用来操作 mongoDB 数据库
 *    - 基于 mongoDB 官方的 mongodb 包做了进一步的封装，操作更方便，提高开发效率
 *
 */

const mongoose = require('mongoose');

/**
 * 2、连接数据库
 *    - 默认端口：27017
 *    - 指定连接的数据库（nodeTest）不需要存在，会自动被创建出来（当然也不是立即创建，而是在创建集合模型或操作数据时）
 *
 */

mongoose.connect('mongodb://localhost/nodeTest');

/**
 * 3、设计集合结构（表结构）
 *
 *    - 以下代码同时定义了多个集合结构
 *
 *    - 集合结构中，对象的 key 就是表字段，对象的值就是对该字段的一些约束（类型、默认值、是否必要）
 *      - 其中 type 的取值就是 js 的常用类型
 *
 *    - 注意这个集合名：
 *      - 无论怎么命名，最终创建时，都会转化成小写英文单词的复数形式，例如：
 *        - User -> users
 *        - users -> users
 *        - userss -> userses
 *
 *    - 注意下面的 Date.now，获取当前时间的方法，每次创建新数据的时候执行该方法，
 *      不能写 Date.now()，否则在创建 model 的时候就会立刻执行，就成为一个定值了
 *
 */

const models = {
  students: {
    name: { type: String, required: true },
    age: Number,
    gender: { type: Number, enum: [0, 1], default: 0 },
    createDate: { type: Date, default: Date.now },
    hidden: Boolean,
  },
  teachers: {
    name: String,
    age: Number,
  },
};

/**
 * 4、创建文档模型（集合）
 *    - 参数1：集合名
 *    - 参数2：集合的结构
 *
 */

for (let table in models) {
  mongoose.model(table, new mongoose.Schema(models[table]));
}

/**
 * 5、进行 CRUD 操作
 *
 *    - 列举了一些最常用的 API，全部的 API 可以参照 Webstorm 智能提示，或者查看 mongoose.model 方法的声明文件，也可以看官方文档
 *
 *    - 关于回调函数中的 ret，有个规律：如果方法是以 find 开头，则 ret 就是操作的数据本身，否则就是一个包含着操作数据数量的对象
 *      - 如果没有匹配到数据，则 ret 是 null
 *
 *    - 注意：crud 的操作都是异步的，查询的时候，未必已经更新完成
 *
 */

/**
 * 5.0、获取集合
 *
 */

const Students = mongoose.model('students');

/**
 * 5.1、新增数据
 *    - insertMany 可以增加一个，也可以增加多个
 *
 */

// const data = [
//   {
//     name: 'Jack',
//     age: 25,
//     hidden: false,
//   },
//   {
//     name: 'Bob',
//     age: 23,
//     hidden: true,
//   },
//   {
//     name: 'melina',
//     age: 24,
//     hidden: false,
//   },
//   {
//     name: 'Handi',
//     age: 25,
//     hidden: false,
//   }
// ];
//
// Students.insertMany(data, function (err, ret) {
//   if (!err) {
//     console.log('添加成功：', ret);
//   }
// });

/**
 * 5.2、查询数据
 *    - find 查询所有满足条件的数据
 *    - findOne 查询第一个满足条件的数据
 *
 */

// Students.find({ age: 25 }, function (err, data) {
//   console.log('query-1:', data);
// });

// Students.findOne({ age: 25 }, function (err, data) {
//   console.log('query-2:', data);
// });

/**
 * 5.3、删除数据
 *    - deleteMany 删除所有，筛选条件可有可无，没有筛选条件，代表删除全部数据，ret 中保存有已删除数据的数量
 *    - deleteOne 根据条件删除查询到的第一个，ret 中保存有已删除数据的数量
 *    - findOneAndDelete 根据条件删除查询到的第一个，ret 是删除的数据
 *    - findByIdAndDelete 根据 id 删除数据，ret 是删除的数据
 *
 */

// Students.deleteMany(function (err, ret) {
//   if (!err) {
//     console.log('全部删除成功：', ret);
//   }
// });

// Students.deleteMany({ age: 25 }, function (err, ret) {
//   if (!err) {
//     console.log('删除成功：', ret);
//   }
// });

// Students.deleteOne({ name: 'Jack' }, function (err, ret) {
//   if (!err) {
//     console.log('删除成功：', ret);
//   }
// });

// Students.findOneAndDelete({ name: 'Jack' }, function (err, ret) {
//   if (!err) {
//     console.log('删除成功：', ret);
//   }
// });

// 注意：这边只是演示，实际 id 可能有所不同，id 是自动生成的
// Students.findByIdAndDelete('6190a9e9b9ee433accf95956', function (err, ret) {
//   if (!err) {
//     console.log('删除成功：', ret);
//   }
// });

/**
 * 5.4、更新数据
 *    - updateMany 更新所有，可以有筛选条件，也可以没有筛选条件（没有筛选条件的话就是更新全部），ret 是关于更新的信息
 *    - updateOne 更新查询到的第一个,ret 是关于更新的信息
 *    - findOneAndUpdate 更新查询到的第一个，ret 是更新的那条数据
 *    - findByIdAndUpdate 根据 id 更新数据，ret 是更新的那条数据
 *
 */

// Students.updateMany({ hidden: true }, function (err, ret) {
//   if (!err) {
//     console.log('全部更新成功：', ret);
//   }
// });

// Students.updateMany({ hidden: true }, { hidden: false }, function (err, ret) {
//   if (!err) {
//     console.log('更新成功：', ret);
//   }
// });

// Students.updateOne({ hidden: false }, { hidden: true },  function (err, ret) {
//   if (!err) {
//     console.log('更新成功：', ret);
//   }
// });

// Students.findOneAndUpdate({ hidden: false }, { hidden: true },  function (err, ret) {
//   if (!err) {
//     console.log('更新成功：', ret);
//   }
// });

// 注意：这边只是演示，实际 id 可能有所不同，id 是自动生成的
Students.findByIdAndUpdate('6190b34716f686f7754c28fe', { hidden: true },  function (err, ret) {
  if (!err) {
    console.log('更新成功：', ret);
  }
});
