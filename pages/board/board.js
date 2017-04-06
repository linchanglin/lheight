
Page({
  data: {
    showTopTips1: false,
    showTopTips2: false,


    inputShowed: false,
    inputVal: "",

    rippleName: "",

    hoverClass: "weui-cell_active",
    hover: false,

    length: 0,
    
  },
  onLoad: function () {
    let that = this;

    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      that.setData({
        wesecret: wesecret
      })
    }

    that.load_loves();

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
  onShow: function () {
    let that = this;
    that.setData({
      showTopTips1: true
    })
  },
  onPullDownRefresh: function () {
    let that = this;

    that.setData({
      showTopTips1: false,
    });

    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000)


    that.load_loves();


    setTimeout(function () {
      that.setData({
        showTopTips2: true
      });
    }, 1000);
    setTimeout(function () {
      that.setData({
        showTopTips2: false
      });
    }, 2500);
  },
  load_loves: function () {
    let that = this;

    if (that.data.wesecret) {
      wx.request({
        url: 'https://collhome.com/api/loves?wesecret=' + that.data.wesecret,
        success: function (res) {
          console.log(res.data)

          that.setData({
            loves: res.data.data
          })
        }
      })
    } else {
      wx.request({
        url: 'https://collhome.com/api/loves',
        success: function (res) {
          console.log(res.data)

          that.setData({
            loves: res.data.data
          })
        }
      })
    }
  },
  previewImage: function (e) {
    console.log('preview e', e);
    var current = e.currentTarget.dataset.current;
    var urls = e.currentTarget.dataset.urls;

    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  setRipple: function () {
    var that = this;
    that.setData({
      rippleName: "bounceIn"
    });
    if (that.data.length == 0) {
      that.setData({
        length: 1
      })
    } else {
      that.setData({
        length: 0
      })
    }
    setTimeout(function () {

      that.setData({
        rippleName: ""
      });
    }, 1000)
  },
  navigateToLove: function (e) {
    console.log('navigateToLove', e);

    var that = this;

    setTimeout(function () {
      that.setData({
        hoverClass: 'weui-cell_active'
      })
    }, 50)
    setTimeout(function () {
      that.setData({
        hoverClass: ''
      })
    }, 450)
    wx.navigateTo({
      url: '../comment/comment?id=22'
    });
  },
  navigateToComment: function (e) {
    console.log('navigateToComment', e);

    var that = this;
    wx.navigateTo({
      url: '../comment/comment?id=22'
    });
  },
  navigateToProfileShow: function (e) {
    let that = this;
    that.setData({
      hoverClass: ''
    })

    console.log('navigateToProfileShow', e);

    wx.navigateTo({
      url: '../profile/profile'
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



});
