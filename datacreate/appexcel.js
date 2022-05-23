const xlsx = require('node-xlsx');
// const fs = require('fs');

/**
 * 创建表格
 * @param excelData
 * @param config 
 */
function createExcel(excelData, config = {}){
    // let xlsxBuildArr = [
    //     {
    //         name:'一班',
    //         data:[
    //             ['姓名', '年龄'],
    //             ['张三', 18],
    //             ['李四', 19]
    //         ]
    //     },
    //     {
    //         name:'二班',
    //         data:[
    //             ['姓名', '年龄'],
    //             ['王五', 18],
    //             ['刘六', 18]
    //         ]
    //     }
    // ];
    for (let i = 0; i < excelData.length; i++) {
      excelData[i] = JSON.parse(excelData[i])
    }
    console.log(excelData)
    let buffer = xlsx.build( excelData );
    // const filename = config.filename || 'fileName.xlsx';
    // //write  default utf-8
    // fs.writeFileSync(
    //     filename,
    //     buffer
    // );
    // console.log( filename + ' 文件已生成 √√√');
    return buffer;
}

module.exports = {
    createExcel
}