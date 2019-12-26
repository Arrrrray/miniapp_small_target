// miniprogram/pages/anniversaryList/addAnniversary/index.js
import moment from '../../../common/js/moment/moment';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    description: '',
    ann_date: moment().format('YYYY-MM-DD'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 标题改变
  bindTitleChange: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  // 描述改变
  bindDescriptionChange: function (e) {
    this.setData({
      description: e.detail.value
    })
  },

  // 日期改变
  bindDateChange: function (e) {
    this.setData({
      ann_date: e.detail.value
    })
  },

  addAnniversary: function () {
    const {
      title,
      description,
      ann_date,
      // time
    } = this.data;
    if (title === '') {
      wx.showModal({
        title: '提示',
        content: '标题不能为空',
        showCancel: false,
        confirmText: '确定',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    const db = wx.cloud.database();
    db.collection('anniversary_list').add({
      data: {
        ann_date,
        create_time: moment().format(),
        title,
        description,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false,
          confirmText: '返回',
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
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
})