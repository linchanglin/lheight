//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    inputShowed: false,
    inputVal: "",
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8]

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      // url: '../logs/logs'
      url: '../profile/profile'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      console.log('userInfo', userInfo);
      //更新数据
      that.setData({
        userInfo: userInfo,
      })
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  previewImage: function(e){
        wx.previewImage({
            current: '../images/m1.jpg', // 当前显示图片的http链接
            urls: ['../images/m1.png'] // 需要预览的图片http链接列表
        })
    }
})
