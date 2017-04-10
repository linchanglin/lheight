Page({
  data: {
    rippleName: "",
    length: 0,


    comments: [
      {
        id: 1,
        content: "九九八十一难，最难过的，其实是女儿国这一关。",
        userInfo: {
          id: 1,
          nickName: "雨碎江南",
          avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hsTibhnpQPxN0eJPoiaNpPq0HSQzG9XpvmicjAjr0x5f1GcNd7LpHoXMgiadUbd4ibn46HibM5FMXBow/0',
        },
        created_at: "2016-12-11",
      },
      {
        id: 2,
        content: "音乐不分年纪，不过令人开心的是你们也不会年轻太久。",
        userInfo: {
          id: 2,
          nickName: "张珊珊",
          avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hsTibhnpQPxN0eJPoiaNpPq0HSQzG9XpvmicjAjr0x5f1GcNd7LpHoXMgiadUbd4ibn46HibM5FMXBow/0',
        },
        created_at: "2016-12-10",
      },
      {
        id: 3,
        content: "看的时候还很小，不太明白里面的故事，长大后才发现西游记里水太深了。",
        userInfo: {
          id: 3,
          nickName: "麦田的守望者",
          avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hsTibhnpQPxN0eJPoiaNpPq0HSQzG9XpvmicjAjr0x5f1GcNd7LpHoXMgiadUbd4ibn46HibM5FMXBow/0',
        },
        created_at: "2016-12-10",
      },
      {
        id: 4,
        content: "想起，小时候，父亲教我这首歌的样子。",
        userInfo: {
          id: 4,
          nickName: "沃德天·娜么帥",
          avatarUrl: 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hsTibhnpQPxN0eJPoiaNpPq0HSQzG9XpvmicjAjr0x5f1GcNd7LpHoXMgiadUbd4ibn46HibM5FMXBow/0',
        },
        created_at: "2016-12-10",
      }
    ],

  },

  onLoad: function (options) {
    console.log('options', options)
    let that = this;
    that.setData({
      love_id: options.love_id
    })
    // that.setData({
    //   love_id: 13
    // })


    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      that.setData({
        wesecret: wesecret
      })
    }

    that.load_love();

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
    console.log('111111');
  },
  load_love: function () {
    let that = this;
    if (that.data.wesecret) {
      wx.request({
        url: 'https://collhome.com/api/loves/' + that.data.love_id + '/comments?wesecret=' + that.data.wesecret,
        success: function (res) {
          console.log('love', res.data)
          let love = res.data.data.love;
          let comments = res.data.data.comments;
          that.setData({
            love: love,
            comments: comments
          })
        }
      })
    } else {
      wx.request({
        url: 'https://collhome.com/api/loves/' + that.data.love_id + '/comments',
        success: function (res) {
          console.log('love', res.data)
          let love = res.data.data.love;
          let comments = res.data.data.comments;

          that.setData({
            love: love,
            comments: comments
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
  navigateToComment: function () {
    let that = this;
    wx.navigateTo({
      url: '../commentInput/commentInput?love_id' + that.data.love_id
    })
  },
  navigateToProfileShow: function (e) {
    console.log('navigateToProfileShow', e);

    let that = this;
    that.setData({
      hoverClass: ''
    })

    let user_id = e.currentTarget.dataset.userid;

    wx.navigateTo({
      url: '../profileShow/profileShow?user_id=' + user_id
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
  deleteArticle: function () {
    wx.showModal({
      title: '提示',
      content: '要删除这条表白吗？',
      confirmColor: '#ff0000',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  }
})