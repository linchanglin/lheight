
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

    reqs: [{
      "content": "女生分手的原因有两个， 一个是：闺蜜看不上。另一个是：闺蜜看上了。",
      "hashId": "607ce18b4bed0d7b0012b66ed201fb08",
      "unixtime": 1418815439,
      "updatetime": "2014-12-17 19:23:59",
      "pictures": ['http://tnfs.tngou.net/img/ext/161223/7083a1fde72448a62e477c5aab0721c8.jpg',
        'http://tnfs.tngou.net/img/ext/161213/c5f1416b4feb857b8d711f83dc692885.jpg',
        'http://tnfs.tngou.net/img/ext/161209/6cc26c6f440c091e0cf78229a9642929.jpg',
        'http://tnfs.tngou.net/img/ext/161213/a94ead894d0d0e4e5b3b807626eeab4d.jpg']
    },

    {
      "content": "老师讲完课后，问道 “同学们，你们还有什么问题要问吗？” 这时，班上一男同学举手， “老师，这节什么课？”",
      "hashId": "20670bc096a2448b5d78c66746c930b6",
      "unixtime": 1418814837,
      "updatetime": "2014-12-17 19:13:57",
      "pictures": ['http://tnfs.tngou.net/img/ext/161223/7083a1fde72448a62e477c5aab0721c8.jpg',
        'http://tnfs.tngou.net/img/ext/161213/c5f1416b4feb857b8d711f83dc692885.jpg',
        'http://tnfs.tngou.net/img/ext/161209/6cc26c6f440c091e0cf78229a9642929.jpg']
    },
    {
      "content": "“老公，结婚前你不是常对我说，我是你的女神吗？” “老婆，现在你总该看出来，自从结婚后，我成了一个无神论者。”",
      "hashId": "1a0b402983f22b7ad6ff38787e238f6d",
      "unixtime": 1418814837,
      "updatetime": "2014-12-17 19:13:57",
      "pictures": ['http://tnfs.tngou.net/img/ext/161223/7083a1fde72448a62e477c5aab0721c8.jpg',
        'http://tnfs.tngou.net/img/ext/161213/c5f1416b4feb857b8d711f83dc692885.jpg']
    },
    {
      "content": "昨天下班坐公交车回家，白天上班坐着坐多了想站一会儿， 就把座位让给了一个阿姨，阿姨道谢一番开始和我聊天，聊了挺多的。 后来我要下车了，阿姨热情的和我道别。 下车的一瞬间我回头看了一眼，只见那阿姨对着手机说：“儿子， 刚才遇见一个姑娘特不错，可惜长得不好看，不然我肯定帮你要号码！” 靠，阿姨你下车，我保证不打死你！",
      "hashId": "d4d750debbb73ced161066368348d611",
      "unixtime": 1418814837,
      "updatetime": "2014-12-17 19:13:57"
    }]
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

    wx.request({
      url: 'https://collhome.com/api/loves?wesecret=' + that.data.wesecret,
      success: function (res) {
        console.log('hahhaa',res.data)

        that.setData({
          loves: res.data
        })
      }
    })
    // if (that.data.wesecret) {
    //   wx.request({
    //     url: 'https://collhome.com/api/loves?wesecret=' + wesecret,
    //     success: function (res) {
    //       console.log(res.data)

    //       that.setData({
    //         loves: res.data
    //       })
    //     }
    //   })
    // } else {
    //   wx.request({
    //     url: 'https://collhome.com/api/loves',
    //     success: function (res) {
    //       console.log(res.data)

    //       that.setData({
    //         loves: res.data
    //       })
    //     }
    //   })
    // }
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
