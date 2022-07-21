
/**
 * 1、mySQL 关系型数据库，需要先创建数据库以及定义表结构
 *
 *    - 这里简单记录一下，在 nodejs 中，大部分情况下还是会使用 mongoDB 数据库
 *
 *    - 只需要一个 API -> query 就可以做所有数据库操作（ CRUD ），写不同的 SQL 语句即可
 *
 *    - 操作数据库时，SQL 语句中的关键词一般使用大写，易于区分，使用小写也是可以的
 *
 */

// 引入
const mysql = require('mysql');

// 创建连接
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'users'
});

// 连接数据库
connection.connect();

// 查询
connection.query('SELECT * FROM user', function (error, results) {
  if (error) throw error;
  console.log('查询结果：', results);
});

// 新增
connection.query('INSERT INTO user VALUES(NULL, "custom", "cuspsd")', function (error, results) {
  if (error) throw error;
  console.log('插入成功：', results);
});

// 关闭数据库，在 mongoose 中似乎不需要关闭的操作
connection.end();
