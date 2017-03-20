Page({
  data: {
    signature: "这一秒，无缘无份，只是在某个地点，擦身而过，也无意相互问好，就这样成为彼此生活中的匆匆过客。这一秒，时间指引你我各自离去；这一秒，距离割断思念如梦辗转。",
    pictures: ['http://tnfs.tngou.net/img/ext/161223/7083a1fde72448a62e477c5aab0721c8.jpg',
'http://tnfs.tngou.net/img/ext/161213/c5f1416b4feb857b8d711f83dc692885.jpg',
'http://tnfs.tngou.net/img/ext/161209/6cc26c6f440c091e0cf78229a9642929.jpg',
'http://tnfs.tngou.net/img/ext/161213/a94ead894d0d0e4e5b3b807626eeab4d.jpg']
  },
  onLoad: function () {
    let that = this;

    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        var length = 3;
        var row = Math.ceil(length / 3);
        var line = Math.ceil(length / row);
        var widthM = ww - 20;
        var widthX = (widthM / line).toFixed(2) - 6;
        var margin = "3px";
        that.setData({
          imgCss: {
            width: widthX + 'px',
            height: widthX + 'px',
            margin: margin
          }
        })
      }
    })
  },

  previewImage: function (e) {
    var that = this;
    console.log('preview e', e);
    var current = e.currentTarget.dataset.current;
    // var urls = e.currentTarget.dataset.urls;

    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: that.data.pictures// 需要预览的图片http链接列表
    })
  },
  // editProfileShow: function () {
  //   wx.navigateTo({
  //     url: '../profileShowInput/profileShowInput'
  //   })
  // }
})