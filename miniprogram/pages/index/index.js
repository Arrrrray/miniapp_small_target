//index.js
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
  },

  onLoad: function() {
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getTodoListOpen();
    this.getTodoListDone();
    this.getTodoListClosed();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getTodoListOpen();
    this.getTodoListDone();
    this.getTodoListClosed();
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
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
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

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

  getTodoListOpen: function() {
    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'getTodoList',
    //   // 传给云函数的参数
    //   data: {},
    //   success: function(res) {
    //     console.log(res)
    //   },
    //   fail: console.error
    // })
    const db = wx.cloud.database();
    const _this = this;
    db.collection('todo_list')
      .where({
        _openid: app.globalData.openid,
        status: 'open',
      })
      .orderBy('deadline', 'desc')
      // .skip(1)
      // .limit(10)
      .get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res);
          this.setData({
            todoListOpen: this.formatTodoList(res.data),
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  },
  getTodoListDone: function() {
    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'getTodoList',
    //   // 传给云函数的参数
    //   data: {},
    //   success: function(res) {
    //     console.log(res)
    //   },
    //   fail: console.error
    // })
    const db = wx.cloud.database();
    const _this = this;
    db.collection('todo_list')
      .where({
        _openid: app.globalData.openid,
        status: 'done',
      })
      .orderBy('deadline', 'desc')
      // .skip(1)
      // .limit(10)
      .get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res);
          this.setData({
            todoListDone: this.formatTodoList(res.data),
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  },
  getTodoListClosed: function() {
    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'getTodoList',
    //   // 传给云函数的参数
    //   data: {},
    //   success: function(res) {
    //     console.log(res)
    //   },
    //   fail: console.error
    // })
    const db = wx.cloud.database();
    const _this = this;
    db.collection('todo_list')
      .where({
        _openid: app.globalData.openid,
        status: 'closed',
      })
      .orderBy('deadline', 'desc')
      // .skip(1)
      // .limit(10)
      .get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res);
          this.setData({
            todoListClosed: this.formatTodoList(res.data),
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  },

  formatTodoList: function(data) {
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

  addTodoList: function() {
    wx.navigateTo({
      url: '/pages/todolist/addTodoList/index',
    })
  }

})