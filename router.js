//导入express
let express = require('express');
//加载路由
let router1 = express.Router();
//导入db
const conn = require('./db');

//查询数据
router1.get('/getUserMsg',(req,res) => {
  console.log('请求了接口222')
  let sqlStr = `SELECT * FROM internetmanager.login`;
  conn.query(sqlStr,(err,results) => {
    if (err) {
      console.log(err);
      res.json({code:1,msg:'获取数据失败'});
    } else {
      console.log(results);
      res.json({code:0,result:results});
    }
  })
})

//获取下拉选择-类型-的所有选项
router1.get('/getAllTypesMsg',(req,res) => {
  let sqlStr = "SELECT * FROM internetmanager.alltypes";
  conn.query(sqlStr,(err,results) => {
    if (err) {
      console.log(err);
      res.json({code:1,msg:'获取数据失败'});
    } else {
      res.json({code:0,result:results});
    }
  })
})

//获取所有下拉选择--级别
router1.get('/getAllLevelsMsg',(req,res) => {
  let sqlStr = "SELECT * FROM internetmanager.alllevels";
  conn.query(sqlStr,(err,results) => {
    if (err) {
      console.log(err);
      res.json({code:1,msg:'获取数据失败'});
    } else {
      res.json({code:0,result:results});
    }
  })
})

//获取所有下拉选择--状态
router1.get('/getAllStatesMsg',(req,res) => {
  let sqlStr = "SELECT * FROM internetmanager.allstates";
  conn.query(sqlStr,(err,results) => {
    if (err) {
      console.log(err);
      res.json({code:1,msg:'获取数据失败'});
    } else {
      res.json({code:0,result:results});
    }
  })
})

//获取所有的选择--属地
router1.get('/getAllLocationsMsg',(req,res) => {
  let sqlStr = "SELECT * FROM internetmanager.alllocations";
  conn.query(sqlStr,(err,results) => {
    if (err) {
      console.log(err);
      res.json({code:1,msg:'获取数据失败'});
    } else {
      res.json({code:0,result:results});
    }
  })
})

//获取app/小程序所有的数据
router1.get('/getAppData',(req,res) => {
  let sqlStr = "SELECT * FROM internetmanager.appmassage";
  conn.query(sqlStr,(err,results) => {
    if (err) {
      console.log(err);
      res.json({code:1,msg:'获取数据失败'});
    } else {
      res.json({code:0,result:results});
    }
  })
})

//插入数据
router1.post('/insertUserMsg',(req,res) => {
  // let sqlStr = `INSERT INTO internetmanager.login VALUES ('张旭东','123456')`;
  // console.log(req.query);
  conn.query(`INSERT INTO internetmanager.login SET ?`,req.query,(err,result) => {
    if(err) {
      res.json({code:1,msg:'插入数据失败'});
    } else {
      res.json({code:0,msg:'插入数据成功'});
    }
  })
})

//删除数据
router1.post('/delUserMsg',(req,res) => {
  conn.query('DELETE FROM internetmanager.login WHERE username=?',req.query.username,(err,result) => {
    if(err) {
      res.json({code:1,msg:'删除数据失败'});
    } else {
      res.json({code:0,msg:'删除数据成功'});
    }
  })
})

//修改数据
//UPDATE internetmanager.login SET password = 333333 WHERE (username = '张旭东');
router1.post('/updateUserMsg',(req,res) => {
  conn.query(`UPDATE internetmanager.login SET password = 333333 WHERE (username = '周大福')`,(err,result) => {
    if(err) {
      res.json({code:1,msg:'修改数据失败'});
    } else {
      res.json({code:0,msg:'修改数据成功'});
    }
  })
})

module.exports = router1;