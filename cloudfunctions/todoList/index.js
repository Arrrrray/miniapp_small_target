// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log(event, context)
  let result;
  if (event.type === 'get') {
    result = getTodoList(event.data);
  }
  if (event.type === 'add') {
    return addTodoList(event.data);
  }

  return result;

  const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}

const getTodoList = (data) => {
  db.collection('todo_list')
    .where({
      _openid: cloud.getWXContext().OPENID,
      status: 'open'
    })
    .orderBy('deadline', 'desc')
    .skip(1)
    .limit(10)
    .get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        return res;
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
        return err;
      }
    })

}

function addTodoList(data) {
  db.collection('todo_list').add({
    data: data,
    success: res => {
      // 在返回结果中会包含新创建的记录的 _id
      wx.showToast({
        title: '新增记录成功',
      })
      console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [新增记录] 失败：', err)
    }
  })
}