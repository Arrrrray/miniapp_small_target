// miniprogram/pages/todolist/todoListDetail/index.js
import moment from '../../../common/js/moment/moment';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    title: '',
    description: '',
    deadline: moment().format('YYYY-MM-DD'),
    // time: moment().format('HH:mm'),
    statusOptions: ['进行中', '已完成', '关闭'],
    statusIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTodoListDetail(options.id)
    this.setData({
      id: options.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  // 获取todoList detail
  getTodoListDetail: function(id) {
    const _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      // 云函数名称
      name: 'todoList',
      // 传给云函数的参数
      data: {
        type: 'get',
        data: {
          _id: id,
        }
      },
      success: function(res) {
        wx.hideLoading()
        let statusIndex = 0;
        if (res.result.data[0].status === 'open') {
          statusIndex = 0;
        } else if (res.result.data[0].status === 'done') {
          statusIndex = 1;
        } else if (res.result.data[0].status === 'closed') {
          statusIndex = 2;
        }
        _this.setData({
          title: res.result.data[0].title,
          description: res.result.data[0].description,
          deadline: res.result.data[0].deadline,
          statusIndex,
        })
      },
      fail: console.error
    })
  },

  // 标题改变
  bindTitleChange: function(e) {
    this.setData({
      title: e.detail.value
    })
  },

  // 描述改变
  bindDescriptionChange: function(e) {
    this.setData({
      description: e.detail.value
    })
  },

  // 日期改变
  bindDateChange: function(e) {
    this.setData({
      deadline: e.detail.value
    })
  },


  bindCountryChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      statusIndex: e.detail.value
    })
  },

  // // 编辑
  // updateTodoList: function() {
  //   const _this = this;
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   const {
  //     id,
  //     title,
  //     description,
  //     deadline,
  //     statusIndex,
  //   } = _this.data;
  //   if (title === '') {
  //     wx.showModal({
  //       title: '提示',
  //       content: '标题不能为空',
  //       showCancel: false,
  //       confirmText: '确定',
  //       success(res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //     return;
  //   }
  //   let status = '';
  //   if (statusIndex == 0) {
  //     status = 'open';
  //   } else if (statusIndex == 1) {
  //     status = 'done';
  //   } else if (statusIndex == 2) {
  //     status = 'closed';
  //   }
  //   wx.cloud.callFunction({
  //     // 云函数名称
  //     name: 'todoList',
  //     // 传给云函数的参数
  //     data: {
  //       type: 'update',
  //       id,
  //       data: {
  //         title,
  //         description,
  //         deadline,
  //         status,
  //       }
  //     },
  //     success: function(res) {
  //       wx.hideLoading()
  //       wx.showModal({
  //         title: '提示',
  //         content: '修改成功',
  //         showCancel: false,
  //         confirmText: '返回',
  //         success(res) {
  //           if (res.confirm) {
  //             _this.goBack();
  //           } else if (res.cancel) {
  //             console.log('用户点击取消')
  //           }
  //         }
  //       })
  //     },
  //     fail: console.error
  //   })
  // },

  // // 删除
  // deleteTodoList: function() {
  //   const _this = this;
  //   const {
  //     id,
  //   } = _this.data;
  //   wx.showModal({
  //     title: '提示',
  //     content: '确认要删除吗？',
  //     success(res) {
  //       if (res.confirm) {
  //         wx.cloud.callFunction({
  //           // 云函数名称
  //           name: 'todoList',
  //           // 传给云函数的参数
  //           data: {
  //             type: 'update',
  //             id,
  //             data: {
  //               status: 'delete',
  //             }
  //           },
  //           success: function(res) {
  //             wx.hideLoading()
  //             wx.showModal({
  //               title: '提示',
  //               content: '删除成功',
  //               showCancel: false,
  //               confirmText: '返回',
  //               success(res) {
  //                 if (res.confirm) {
  //                   _this.goBack();
  //                 }
  //               }
  //             })
  //           },
  //           fail: console.error
  //         })
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },

  // 编辑
  updateTodoList: function() {
    const _this = this;
    const {
      id,
      title,
      description,
      deadline,
      statusIndex,
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
    let status = '';
    if (statusIndex == 0) {
      status = 'open';
    } else if (statusIndex == 1) {
      status = 'done';
    } else if (statusIndex == 2) {
      status = 'closed';
    }
    console.log(statusIndex, status)
    const db = wx.cloud.database();
    db.collection('todo_list').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        title,
        description,
        deadline,
        status,
      },
      success: function(res) {
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

  // 删除
  deleteTodoList: function() {
    const _this = this;
    const {
      id,
      title,
      description,
      deadline,
    } = _this.data;
    wx.showModal({
      title: '提示',
      content: '确认要删除吗？',
      success(res) {
        if (res.confirm) {
          const db = wx.cloud.database();
          db.collection('todo_list').doc(id).update({
            // data 传入需要局部更新的数据
            data: {
              status: 'delete',
            },
            success: function(res) {
              wx.showModal({
                title: '提示',
                content: '删除成功',
                showCancel: false,
                confirmText: '返回',
                success(res) {
                  if (res.confirm) {
                    _this.goBack();
                  }
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 返回
  goBack: function() {
    wx.navigateBack({
      delta: 1,
    })
  },
})