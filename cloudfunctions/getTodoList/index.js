// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(123)
  await db.collection('todo_list')
    .where({
      _openid: wxContext.OPENID,
      status: 'open',
    })
    .orderBy('deadline', 'desc')
    // .get();
    // console.log("test=", test);
    // return test;
    .get().then(res => {

      console.log(res)
    })


  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}