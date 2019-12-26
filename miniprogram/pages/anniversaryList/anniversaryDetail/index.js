// miniprogram/pages/anniversaryList/anniversaryDetail/index.js
import moment from '../../../common/js/moment/moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title: '',
    description: '',
    ann_date: moment().format('YYYY-MM-DD'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAnniversaryDetail(options.id)
    this.setData({
      id: options.id,
    })
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

  // anniversaryList detail
  getAnniversaryDetail: function (id) {
    const _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'anniversaryList',
      // 传给云函数的参数
      data: {
        type: 'get',
        data: {
          _id: id,
        }
      },
      success: function (res) {
        wx.hideLoading()
        _this.setData({
          title: res.result.data[0].title,
          description: res.result.data[0].description,
          ann_date: res.result.data[0].ann_date,
        })
      },
      fail: console.error
    })
  },

  // 编辑
  updateAnniversary: function () {
    const _this = this;
    const {
      id,
      title,
      description,
      ann_date,
    } = _this.data;
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
    db.collection('anniversary_list').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        title,
        description,
        ann_date,
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '修改成功',
          showCancel: false,
          confirmText: '返回',
          success(res) {
            if (res.confirm) {
              _this.goBack();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
    })
  },

  // 返回
  goBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
})