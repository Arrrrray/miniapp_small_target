// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('event', event);
  if (event.type === 'get') {
    return await getTodoList(event.data);
  }
  if (event.type === 'add') {
    return await addTodoList(event.data);
  }
  if (event.type === 'update') {
    return updateTodoList(event.id, event.data);
  }
}

const getTodoList = (data) => {
  const res = db.collection('todo_list')
    .where({
      _openid: cloud.getWXContext().OPENID,
      ...data,
    })
    .orderBy('deadline', 'desc')
    .get()

  return res;
}

const addTodoList = (data) => {
  const res = db.collection('todo_list').add({
      // data 字段表示需新增的 JSON 数据
      data: data,
    })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)
  return res;
}

const updateTodoList = (id, data) => {
  console.log(id, data)
  // try {
  //   return await db.collection('todo_list').where({
  //       _id: id
  //     })
  //     .update({
  //       data: data,
  //     })
  // } catch (e) {
  //   console.error(e)
  // }
}