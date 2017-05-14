Page({
  data: {
    signature: "这一秒，无缘无份，只是在某个地点，擦身而过，也无意相互问好，就这样成为彼此生活中的匆匆过客。这一秒，时间指引你我各自离去；这一秒，距离割断思念如梦辗转。",
  },
  onLoad: function (option) {
    let that = this;

    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      that.setData({
        wesecret: wesecret
      })
    }

    if (option.user_id) {
      that.load_user(option.user_id);
    } else {
      that.load_user();
    }
    console.log('option', option);


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

  load_user: function (user_id) {
    let that = this;
    let url;
    if (user_id) {
      url = 'https://collhome.com/shangongyuan/api/users/' + user_id
    } else {
      url = 'https://collhome.com/shangongyuan/api/user?wesecret=' + that.data.wesecret
    }

    wx.request({
      url: url,
      success: function (res) {
        console.log('user', res.data)

        that.setData({
          userInfo: res.data.data
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
      urls: that.data.userInfo.pictures// 需要预览的图片http链接列表
    })
  },
  // editProfileShow: function () {
  //   wx.navigateTo({
  //     url: '../profileShowInput/profileShowInput'
  //   })
  // }
})