// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.type === 'get') {
    return await getAnniversaryList(event.data);
  }
  if (event.type === 'add') {
    return await addAnniversaryList(event.data);
  }
  if (event.type === 'update') {
    return updateAnniversaryList(event.id, event.data);
  }
}

const getAnniversaryList = (data) => {
  const res = db.collection('anniversary_list')
    .where({
      _openid: cloud.getWXContext().OPENID,
      ...data
    })
    .orderBy('create_time', 'desc')
    .get()

  return res;
}

const addAnniversaryList = (data) => {
  const res = db.collection('anniversary_list').add({
    // data 字段表示需新增的 JSON 数据
    data: data,
  })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)
  return res;
}

const updateAnniversaryList = (id, data) => {
  console.log(id, data)
  // try {
  //   return await db.collection('anniversary_list').where({
  //     _id: id
  //   })
  //     .update({
  //       data: data,
  //     })
  // } catch (e) {
  //   console.error(e)
  // }
}