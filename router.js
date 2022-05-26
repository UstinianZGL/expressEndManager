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
const { json } = require('body-parser');

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

//查询数据
router1.get('/getApplyList',(req,res) => {
  let sqlStr = `SELECT * FROM internetmanager.applylist order by applyDate desc`;
  conn.query(sqlStr,(err,results) => {
    if (err) {
      console.log(err);
      res.json({code:1,msg:'获取数据失败'});
    } else {
      // console.log(results);
      res.json({code:0,result:results});
    }
  })
})


//获取用户注册管理员申请结果记录
router1.get('/getApplyResultMass',(req,res) => {
  let sqlStr = `SELECT * FROM internetmanager.allapplylist order by applyDate desc`;
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


//添加用户注册管理员申请结果记录
router1.post('/addApplyResultMass',(req,res) => {
  // console.log(req.query)
  conn.query(`INSERT INTO internetmanager.allapplylist SET ?`,req.query,(err,result) => {
    if(err) {
      console.log(err);
      res.json({code:0,msg:'插入数据失败'});
    } else {
      res.json({code:1,msg:'插入数据成功'});
    }
  })
})


//修改下拉框选项数据--状态/级别/属地/类型
/**
 *  useTable:"alllevels",
    updateArr:[
      {
        id: 1,
        newVal: 'hhhh'
      }
    ],
    dataValName:levelVal,
 * 
 */
router1.post('/updateSelectMass',(req,res) => {
  let useTable = req.query.useTable,
      updateArr = req.query.updateArr,
      dataValName = req.query.dataValName;
  console.log(updateArr);
  for(let i = 0; i < updateArr.length; i++) {
    updateArr[i] = JSON.parse(updateArr[i]);
  }
  let baseStr = "UPDATE internetmanager." + useTable;
  for(let item of updateArr) {
    let sqlStr = baseStr + " SET ? WHERE (id = '" + item.id + "')";
    let queryData = {};
    queryData[dataValName] = item[dataValName];
    conn.query(sqlStr,queryData,(err,result) => {
      if(err) {
        console.log(err);
        res.json({code:0,msg:'修改数据失败'});
        return ;
      }
    })
  }
  res.json({code:1,msg:'修改数据成功'});
})


//添加下拉框选项数据--状态/级别/属地/类型
/**
 * useTable:"alllevels",
   addArr:[
     {
       levelId:1,
       levelVal:'hhh'
     }
   ],
 * 
 */
router1.post('/addSelectMass',(req,res) => {
  let useTable = req.query.useTable,
      addArr = req.query.addArr;
  for(let i = 0; i < addArr.length; i++) {
    addArr[i] = JSON.parse(addArr[i]);
  }
  console.log(addArr);
  let baseStr = `INSERT INTO internetmanager.` + useTable;
  for(let item of addArr) {
    let sqlStr = baseStr + ` SET ?`;
    conn.query(sqlStr,item,(err,result) => {
      if(err) {
        console.log(err);
        res.json({code:0,msg:'添加数据失败'});
        return;
      }
    })
  }
  res.json({code:1,msg:'添加数据成功'});
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
/* req.query: {
    pageIndex:pageIndex,
    pageSize:Number(query.pageSize),
    dataType:dataType,
    searchQuery:query
  } 
*/
router1.get('/getAppData',(req,res) => {
  const result = {totalSize:0};
  let pageIndex = Number(req.query.pageIndex),
      pageSize = Number(req.query.pageSize);
      dataType = Number(req.query.dataType);
      searchQuery = JSON.parse(req.query.searchQuery);
  if (dataType === 0) {   //获取搜索条件的所有结果
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
  } else {  //按照搜索条件进行搜索
    let searchStr = ""
    let searchArr = [];
    if (searchQuery['corporateName'] !== "") {
      let str = " corporateName=" + "'" + searchQuery['corporateName'] + "'";
      searchArr.push(str);
    }
    if (searchQuery['name'] !== "") {
      let str = "name=" + "'" + searchQuery['name'] + "'";
      searchArr.push(str);
    }
    if (searchQuery['sponsor'] !== "") {
      let str = "sponsor=" + "'" + searchQuery['sponsor'] + "'";
      searchArr.push(str);
    }
    if (searchQuery['level'] !== "") {
      let str = "level=" + searchQuery['level'];
      searchArr.push(str);
    }
    if (searchQuery['state'] !== "") {
      let str = "state=" + searchQuery['state'];
      searchArr.push(str);
    }
    if (searchQuery['type'] !== "") {
      let str = "type=" + searchQuery['type'];
      searchArr.push(str);
    }
    let startNum = searchQuery['loadStart'];
    let endNum = searchQuery['loadEnd'];
    if ((startNum <= endNum) && ((startNum !== 0) || (endNum !== 0))) {
      let str = 'loadingNum >= ' + startNum +' and loadingNum <=' + endNum;
      searchArr.push(str) 
    }
    for(let i = 0; i < searchArr.length; i++) {
      if (i == 0) {
        searchStr = searchStr + searchArr[i];
      } else {
        searchStr = searchStr + ' and ' + searchArr[i];
      }
    }
    let baseSearch = "SELECT * FROM internetmanager.appmassage where " + searchStr + ' order by createDate desc';
    conn.query(baseSearch,(err,results) => {
      result.totalSize = results.length;
    })
    let dataStart = (pageIndex - 1) * pageSize;
    let partSearch = baseSearch + " limit " + dataStart + ',' + pageSize;
    conn.query(partSearch,(err,results) => {
      if (err) {
        console.log(err);
        res.json({code:1,msg:'获取数据失败'});
      } else {
        result.resultList = results
        res.json({code:0,result:result});
      }
    })
  
  }
  
  
})


//app/小程序---插入数据
router1.post('/insertAppMsg',(req,res) => {
  // let sqlStr = `INSERT INTO internetmanager.login VALUES ('张旭东','123456')`;
 
  let dataList = req.query.dataList,
      type = Number(req.query.type);
  // console.log(dataList);
  if (type === 0) {  //表示单个插入，dataList是个对象
    console.log('单个插入');
    dataList = JSON.parse(dataList);
    conn.query(`INSERT INTO internetmanager.appmassage SET ?`,dataList,(err,result) => {
      if(err) {
        console.log(err);
        res.json({code:1,msg:'数据插入失败'});
        return;
      } else {
        res.json({code:0,msg:'数据插入成功'});
      }
    })
  } else {   //多个插入
    console.log('多个插入')
    for(let i = 0; i < dataList.length; i++) {
      dataList[i] = JSON.parse(dataList[i]);
    }
    for(let item of dataList) {
      conn.query(`INSERT INTO internetmanager.appmassage SET ?`,item,(err,result) => {
        if(err) {
          console.log(err);
          res.json({code:1,msg:'数据插入失败'});
          return;
        } 
      })
    }
    res.json({code:0,msg:'成功插入' + dataList.length + '个数据'});
  }
})


//app/小程序--修改数据
router1.post('/updateAppMsg',(req,res) => {
  let queryData = JSON.parse(req.query.updateData),
      id = Number(req.query.massId);
  let sqlStr = "UPDATE internetmanager.appmassage SET ? WHERE (id = '" + id + "')";
  console.log(queryData);
  console.log('---------------------');
  console.log(sqlStr);
  conn.query(sqlStr,queryData,(err,result) => {
    if(err) {
      res.json({code:1,msg:'修改数据失败'});
    } else {
      res.json({code:0,msg:'修改数据成功'});
    }
  })
})

//app/小程序---删除数据
router1.post('/delApprMsg',(req,res) => {
  let massIdArr = req.query.massIds;
  console.log(massIdArr)
  for(let item of massIdArr) {
    conn.query('DELETE FROM internetmanager.appmassage WHERE id=?',item,(err,result) => {
      if(err) {
        console.log(err);
        res.json({code:1,msg:'删除数据失败'});
        return;
      } 
    })
  }
  res.json({code:0,msg:'删除数据成功'});
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



//删除某个已经处理的待审核数据
router1.post('/deleteApplyMass',(req,res) => {
  let sqlStr = 'DELETE FROM internetmanager.applylist WHERE id=' + req.query.id;
  console.log(sqlStr)
  conn.query(sqlStr,(err,result) => {
    if(err) {
      console.log(err);
      res.json({code:0,msg:'删除数据失败'});
    } else {
      res.json({code:1,msg:'删除数据成功'});
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
router1.get('/updateUserMsg',(req,res) => {
  let queryData = {
    password:'123222',
  }
  conn.query(`UPDATE internetmanager.login SET ? WHERE (username = '周大福')`,queryData,(err,result) => {
    if(err) {
      res.json({code:1,msg:'修改数据失败'});
    } else {
      res.json({code:0,msg:'修改数据成功'});
    }
  })
})



//验证登录信息
//SELECT * FROM internetmanager.logintable WhERE username='周希' and password='123456';
router1.post('/checkUserLogin',(req,res) => {
  let sqlStr = `SELECT * FROM internetmanager.logintable WHERE username='` + req.query.username + "' and password='" + req.query.password + "'";
  conn.query(sqlStr,(err,results) => {
    if (err) {
      console.log(err);
      res.json({code:0,msg:'获取数据失败'});
    } else {
      // console.log(results);
      if (results.length === 0) {
        res.json({code:0,msg:'获取数据失败,用户名或密码有误'});
      } else {
        res.json({code:1,result:results});
      }
    }
  })
})


//添加登录信息
router1.post('/addUserLogin',(req,res) => {
  // console.log(req.query)
  conn.query(`INSERT INTO internetmanager.logintable SET ?`,req.query,(err,result) => {
    if(err) {
      console.log(err);
      res.json({code:0,msg:'插入数据失败'});
    } else {
      res.json({code:1,msg:'插入数据成功'});
    }
  })
})


//注销用户信息
router1.post('/cancelUserMass',(req,res) => {
  // console.log(req.query)
  conn.query('DELETE FROM internetmanager.logintable WHERE ?',req.query,(err,result) => {
    if(err) {
      console.log(err);
      res.json({code:0,msg:'删除数据失败'});
    } else {
      res.json({code:1,msg:'删除数据成功'});
    }
  })
})

//添加管理员申请信息
router1.post('/addApplyMass',(req,res) => {
  console.log(req.query);
  conn.query(`INSERT INTO internetmanager.applylist SET ?`,req.query,(err,result) => {
    if(err) {
      console.log(err);
      res.json({code:0,msg:'插入数据失败'});
    } else {
      res.json({code:1,msg:'插入数据成功'});
    }
  })
})




module.exports = router1;