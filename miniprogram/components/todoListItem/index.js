// components/todoListItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
      type: Object,
      value: {
        date: '2019年12月24',
        text: '完成小目标这个小程序'
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateToDetail: function(e) {
      console.log(e)
      const id = e.currentTarget.id
      wx.navigateTo({
        url: `/pages/todolist/todoListDetail/index?id=${id}`,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }

  }
})