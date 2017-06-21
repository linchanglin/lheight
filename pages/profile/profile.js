var app = getApp()

Page({
  data: {},
  onLoad: function () {
    let that = this;
    let wesecret = wx.getStorageSync('wesecret');
    wx.request({
      url: 'https://collhome.com/shanghai/apis/user?wesecret=' + wesecret,

      success: function (res) {
        console.log('userInfo', res.data)

        that.setData({
          userInfo: res.data.data
        })
      }
    })

  }
})