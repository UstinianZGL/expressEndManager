//创建服务器
const express = require('express')

const app = express();

//启动监听服务器
app.listen('8080',()=>{
    console.log('serve runing at port 8080')
})
// 引入mysql
const mysql = require('mysql');

//创建链接
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'209189',
    database:'internetmanager'
})
//链接数据库
db.connect()
// 添加
// app.get('/add/:id',(req,res)=>{
//     const id = req.params.id;
//     const posts = {
//         id:id,
//         name:`name${Math.random()*10}`,
//         price:'80000'
//     }
//     const sql = 'INSERT INTO products SET?';
//     db.query(sql,posts,(error,result) =>{
//         if(error){
//         }else{
//             const data = JSON.stringify(result);
//              res.code = 200;
//              res.status =200
//              res.send(`添加成功${id}`);
//         }
//     })
// })
// // 删除数据
// app.get('/delete/:id',(req,res) =>{
//     const sql = `DELETE FROM PRODUCTS WHERE id = ${req.params.id}`
//     db.query(sql,(error,result) =>{
//         if(error){

//         }else{
//             console.log(result);
//             res.send(`delete ${req.params.id} success...`)
//         }
//     })
// })
// 更新
// app.get('/update/:id',(req,res) =>{
//     const sql = `UPDATE PRODUCTS SET name ='hahah' WHERE id = ${req.params.id}`;
//     db.query(sql,(error,result) =>{
//         if(error){

//         }else{
//             console.log(result);
//             res.send(`update ${req.params.id} success ...`)
//         }
//     })
// })
// 查询
app.get('/loginmass',(req,res) =>{
    console.log('请求了数据111');
    const sql = `SELECT * FROM internetmanager.login`;
    db.query(sql,(error,result) =>{
        if(error){

        }else{
            res.json(result)
        }
    })
})
