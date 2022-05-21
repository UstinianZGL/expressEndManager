//导入express
let express = require('express');
//导入body-parser
const bodyParser = require('body-parser');
//创建一个app
let app = express();

//设置跨域访问
const cors = require("cors")
//在路由之前调用app.use(cors())
 app.use(cors())

//引入对应的路由
const router1 = require('./router');
//使用路由router
app.use('/api',router1);
//挂载参数处理中间件(post)
app.use(bodyParser.urlencoded({extended:false}));
//处理json格式参数
app.use(bodyParser.json)

//监听
app.listen(8082, (req,res) => {
  console.log('运行成功http://localhost:8082');
})




