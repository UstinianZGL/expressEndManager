//连接数据库的操作文件

//导入包
const mysql = require('mysql');

//获取连接
const conn = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'209189',
  database:'internetmanager',
  multipleStatements:true
})

conn.connect();
//导出对应的conn
module.exports = conn;