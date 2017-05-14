// pages/commentInput/commentInput.js
Page({
  data: {},
  onLoad: function (options) {
    console.log('commentInput  options', options)
    let that = this;
    that.setData({
      love_id: options.love_id
    })

    let wesecret = wx.getStorageSync('wesecret');
    that.setData({
      wesecret: wesecret
    })
  },
  bindContentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  confirmInput: function () {
    let that = this;
    console.log('confirmInput    that.data.love_id', that.data.love_id);
    wx.request({
      url: 'https://collhome.com/shangongyuan/api/loves/' + that.data.love_id + '/comments',
      method: 'POST',
      data: {
        wesecret: that.data.wesecret,
        content: that.data.content
      },
      success: function (res) {
        console.log('post comment', res.data)
        wx.setStorageSync('love_need_refresh', 1);
        wx.setStorageSync('board_loves_need_refresh', 1);
        wx.setStorageSync('my_loves_need_refresh', 1);
        wx.navigateBack()
      }
    })
  }
})