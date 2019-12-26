//index.js
import moment from '../../common/js/moment/moment.js';
import utils from '../../utils/index';
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    todoListOpen: [],
    todoListDone: [],
    todoListClosed: [],
    anniversaryList: [], // 纪念日列表
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    });
    this.getAnniversaryList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAnniversaryList();
    // this.getTodoListOpen();
    // this.getTodoListDone();
    // this.getTodoListClosed();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getAnniversaryList();
    // this.getTodoListOpen();
    // this.getTodoListDone();
    // this.getTodoListClosed();
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  getTodoListOpen: function () {
    wx.showLoading({
      title: '加载中',
    })
    const _this = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'todoList',
      // 传给云函数的参数
      data: {
        type: 'get',
        data: {
          status: 'open',
        }
      },
      success: function (res) {
        wx.hideLoading()
        _this.setData({
          todoListOpen: _this.formatTodoList(res.result.data),
        })
      },
      fail: console.error
    })
  },
  getTodoListDone: function () {
    wx.showLoading({
      title: '加载中',
    })
    const _this = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'todoList',
      // 传给云函数的参数
      data: {
        type: 'get',
        data: {
          status: 'done',
        }
      },
      success: function (res) {
        wx.hideLoading()
        _this.setData({
          todoListDone: _this.formatTodoList(res.result.data),
        })
      },
      fail: console.error
    })
  },
  getTodoListClosed: function () {
    wx.showLoading({
      title: '加载中',
    })
    const _this = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'todoList',
      // 传给云函数的参数
      data: {
        type: 'get',
        data: {
          status: 'closed',
        }
      },
      success: function (res) {
        wx.hideLoading()
        _this.setData({
          todoListClosed: _this.formatTodoList(res.result.data),
        })
      },
      fail: console.error
    })
  },

  formatTodoList: function (data) {
    const newData = data.map((item, index) => {
      return {
        id: item._id,
        title: item.title,
        description: item.description,
        status: item.status,
        deadline: item.deadline,
      }
    });
    return newData;
  },

  addTodoList: function () {
    wx.navigateTo({
      url: '/pages/todolist/addTodoList/index',
    })
  },

  addAnniversary: function () {
    wx.navigateTo({
      url: '/pages/anniversaryList/addAnniversary/index',
    })
  },

  getAnniversaryList() {
    wx.showLoading({
      title: '加载中',
    })
    const _this = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'anniversaryList',
      // 传给云函数的参数
      data: {
        type: 'get',
        data: {}
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res);
        console.log(_this.formatAnniversaryList(res.result.data));
        _this.setData({
          anniversaryList: _this.formatAnniversaryList(res.result.data),
        })
      },
      fail: console.error
    })
  },

  formatAnniversaryList(data) {
    const newData = data.map((item, index) => {
      return {
        id: item._id,
        title: item.title.slice(0, 20),
        description: item.description,
        ann_date: moment(item.ann_date).format('YYYY-MM-DD dddd'),
        before_today: utils.diffToday(item.ann_date),
        diff_today: Math.abs(utils.diffToday(item.ann_date)),
      }
    });
    return newData;
  },

})