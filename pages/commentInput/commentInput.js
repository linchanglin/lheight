// pages/commentInput/commentInput.js
Page({
  data: {},
  onLoad: function (options) {
    console.log('options', options)
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
    wx.request({
      url: 'https://collhome.com/api/loves/' + that.data.love_id + '/comments',
      method: 'POST',
      data: {
        wesecret: that.data.wesecret,
        content: that.data.content
      },
      success: function (res) {
        console.log(res.data)
        wx.navigateBack()
      }
    })
  }
})