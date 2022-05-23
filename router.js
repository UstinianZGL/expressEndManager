//导入express
let express = require('express');
//加载路由
let router1 = express.Router();
//导入db
const conn = require('./db');
//excel插件对象
const xlsx = require('node-xlsx')
const fs = require('fs')


const {createExcel} = require('./datacreate/appexcel.js');

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
// req.query: {pageIndex:'1',pageSize:'8'}
router1.get('/getAppData',(req,res) => {
  
  const result = {totalSize:0};
  let pageIndex = Number(req.query.pageIndex),
      pageSize = Number(req.query.pageSize);
  //获取搜索条件的所有结果
  let sqlStr1 = "SELECT * FROM internetmanager.appmassage order by createDate desc";
  conn.query(sqlStr1,(err,results) => {
    result.totalSize = results.length;
  })
  let dataStart = (pageIndex - 1) * pageSize;
  let sqlStr2 = "SELECT * FROM internetmanager.appmassage order by createDate desc limit " + dataStart + ',' + pageSize;
  conn.query(sqlStr2,(err,results) => {
    if (err) {
      console.log(err);
      res.json({code:1,msg:'获取数据失败'});
    } else {
      result.resultList = results
      res.json({code:0,result:result});
    }
  })
})


//app/小程序---插入数据
router1.post('/insertAppMsg',(req,res) => {
  // let sqlStr = `INSERT INTO internetmanager.login VALUES ('张旭东','123456')`;
 
  let dataList = req.query.dataList,
      type = req.query.type
  if (type === 0) {  //表示单个插入，dataList是个对象
    dataList = JSON.parse(dataList);
  } else {   //多个插入
    for(let i = 0; i < dataList.length; i++) {
      dataList[i] = JSON.parse(dataList[i]);
    }
  }
  // console.log(dataList);
  for(let item of dataList) {
    // console.log(item);
    conn.query(`INSERT INTO internetmanager.appmassage SET ?`,item,(err,result) => {
      if(err) {
        console.log(err);
        res.json({code:1,msg:'数据插入失败'});
        return;
      } 
    })
  }
  res.json({code:0,msg:'成功插入' + dataList.length + '个数据'});
  
})



//excel导出下载模板接口
router1.get('/getAppExcelData',(req,res) => {
  // // 首先，读取本地excel模板文件，并解析成node-xlsx插件需要的数据格式，
  // // （比如我的表格文件在代码中的excel文件夹下）要引入fs文件模块才能读取哦
  // const dataByParse = xlsx.parse(fs.readFileSync('./excel/app批量导入模板.xlsx'));

  // /* 
  //    打印出来的数据是一个数组，数组中的每一项（每一个对象）都是一个sheet数据，name属性指定的是每一个sheet的名字
  //    data属性是一个数组，数组中存放的是表格对应每个sheet的数据，data数组中的第一项是“表头”的数据，也可以理解为是
  //    第一行的数据，后面的每一项就是对应每一行“表体”的数据，具体格式，后续也会举例。
  // */ 
  // console.log(dataByParse);

  // // 最后一步，使用xlsx插件自带的build方法将解析后的数据转换成为excel表格（buffer形式的流文件）
  // // 以流文件的形式返回给前端，前端接收解析下载即可
  // res.send(xlsx.build(dataByParse))


    let excelData = req.query.appData;
    // console.log(typeof excelData);
    // 这里根据 你的情况 来写 createExcel 
    const xlsxBuffer = createExcel(excelData, {});
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8');
    // res.setHeader("Content-Disposition", "attachment; filename=aaa.xlsx");
    // res.send( xlsxBuffer );
    // res.end( xlsxBuffer, 'binary' );
    res.end( xlsxBuffer.toString('base64') );
})




//插入数据
router1.get('/insertUserMsg',(req,res) => {
  // let sqlStr = `INSERT INTO internetmanager.login VALUES ('张旭东','123456')`;
  // console.log(req.query);
  let listData = [
    {
      username:'赵默笙',
      password:'123456'
    },
    {
      username:'周含雨',
      password:'123456'
    }
  ]
  // let listData ={
  //   username:'赵含雨',
  //   password:'123456'
  // }
  conn.query(`INSERT INTO internetmanager.login SET ?`,listData,(err,result) => {
    if(err) {
      console.log(err);
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