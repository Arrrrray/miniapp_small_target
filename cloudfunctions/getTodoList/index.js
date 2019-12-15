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
  db.collection('todo_list')
    .where({
      // _openid: wxContext.OPENID,
      status: 'open',
    })
    .orderBy('deadline', 'desc')
    .skip(1)
    .limit(10)
    .get({
      success: res => {
        console.log(345)
        console.log(res);
        return {
          res,
          event,
          openid: wxContext.OPENID,
          appid: wxContext.APPID,
          unionid: wxContext.UNIONID,
        }
      },
      fail: err => {
        return {
          err,
          event,
          openid: wxContext.OPENID,
          appid: wxContext.APPID,
          unionid: wxContext.UNIONID,
        }
      }
    })


  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}