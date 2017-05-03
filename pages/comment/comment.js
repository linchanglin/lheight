Page({
  data: {},

  onLoad: function (options) {
    console.log('options', options)
    let that = this;
    // that.setData({
    //   love_id: options.love_id
    // })

    that.setData({
      love_id: 1
    })

    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      that.setData({
        wesecret: wesecret
      })

      that.load_userInfo();

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
    let that = this;
    let love_need_refresh = wx.getStorageSync('love_need_refresh')
    if (love_need_refresh) {
      that.load_love();
      wx.removeStorageSync('love_need_refresh')
    }
  },
  onPullDownRefresh: function () {
    let that = this;

    that.load_love('pulldown');
  },
  load_love: function (pulldown) {
    let that = this;
    let url;
    if (that.data.wesecret) {
      url = 'https://collhome.com/apis/loves/' + that.data.love_id + '/comments?wesecret=' + that.data.wesecret
    } else {
      url = 'https://collhome.com/apis/loves/' + that.data.love_id + '/comments'
    }
    wx.request({
      url: url,
      success: function (res) {
        console.log('love', res.data)
        let love = res.data.data.love;
        let comments = res.data.data.comments;
        that.setData({
          love: love,
          comments: comments
        })

        if (pulldown) {
          wx.stopPullDownRefresh();
          console.log('pulllllll');
        }
      }
    })
  },
  load_userInfo: function () {
    var that = this;
    wx.request({
      url: 'https://collhome.com/apis/user?wesecret=' + that.data.wesecret,
      success: function (res) {
        console.log('user with wesecret', res.data)

        that.setData({
          userInfo: res.data.data
        })
      }
    })
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
  navigateToCommentInput: function () {
    let that = this;
    if (that.data.wesecret) {
      wx.navigateTo({
        url: '../commentInput/commentInput?love_id=' + that.data.love_id
      })
    } else {
      that.signIn();
    }

  },
  navigateToProfileShow: function (e) {
    console.log('navigateToProfileShow', e);

    let that = this;

    let user_id = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../profileShow/profileShow?user_id=' + user_id
    })
  },
  navigateToLocation: function (e) {
    console.log('location', e);
    let location = e.currentTarget.dataset.location;

    console.log('location', location);

    wx.openLocation({
      name: location.name,
      address: location.address,
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude)
      // scale: 28
    })
  },
  navigateToReplys: function (e) {
    console.log('navigateToReplys', e);
    let comment_id = e.currentTarget.dataset.commentid;

    wx.navigateTo({
      url: `../reply/reply?comment_id=${comment_id}`
    });
  },
  navigateToReply: function (e) {
    console.log('navigateToReply', e);
    let comment_id = e.target.dataset.commentid;
    console.log('comment_id', comment_id);

    var that = this;
    that.setData({
      item_selected_comment_id: comment_id
    })

    setTimeout(function () {
      that.setData({
        item_selected_comment_id: ''
      })
    }, 450)

    wx.navigateTo({
      url: '../reply/reply?comment_id=' + comment_id
    });
  },
  praiseLove: function (e) {
    console.log('praiseLove e', e);
    let love_id = e.currentTarget.dataset.loveid;
    let love_if_my_praise = e.currentTarget.dataset.loveifmypraise;
    let that = this;


    if (that.data.wesecret) {
      let praise;
      if (love_if_my_praise == 0) {
        praise == 1;
      } else {
        praise == 0;
      }
      wx.request({
        url: 'https://collhome.com/apis/loves/' + love_id + '/praises',
        method: 'POST',
        data: {
          wesecret: that.data.wesecret,
          praise: praise
        },
        success: function (res) {
          let old_love = that.data.love;
          old_love.praise_nums = parseInt(old_love.praise_nums);
          if (love_if_my_praise == 0) {
            old_love.if_my_praise = 1;
            old_love.praise_nums++
          } else {
            old_love.if_my_praise = 0
            old_love.praise_nums--
          }
          that.setData({
            love: old_love,
            selected_love_id: love_id
          })
          wx.setStorageSync('board_loves_need_refresh', 1);
          wx.setStorageSync('my_loves_need_refresh', 1);
        }
      })
    } else {
      that.signIn();
    }
  },
  signIn: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '您还未登录呢，立即使用微信登录!',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.login({
            success: (res) => {
              const code = res.code
              if (code) {
                wx.getUserInfo({
                  success: (res) => {
                    console.log('res', res);
                    console.log('code', code, 'encryptedData', res.encryptedData, 'iv', res.iv)
                    that.postRegister(code, res.encryptedData, res.iv);
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          });
        }
      }
    })
  },
  postRegister: function (code, encryptedData, iv) {
    let that = this;

    wx.request({
      url: 'https://collhome.com/apis/register',
      method: 'POST',
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv
      },
      success: function (res) {
        console.log('res', res);

        wx.setStorageSync('wesecret', res.data);
        that.setData({
          wesecret: res.data,
        })
        that.load_userInfo();
      }
    })
  },
  deleteArticle: function () {
    let that = this;
    wx.showModal({
      title: '删除',
      content: '您要删除这条表白吗？',
      confirmColor: '#ff0000',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({
            url: 'https://collhome.com/apis/delete/love',
            method: 'POST',
            data: {
              wesecret: that.data.wesecret,
              love_id: that.data.love_id
            },
            success: function (res) {
              console.log('delete love success', res.data)
              wx.setStorageSync('board_loves_need_refresh', 1);
              wx.setStorageSync('hot_loves_need_refresh', 1);
              wx.setStorageSync('college_loves_need_refresh', 1);
              wx.setStorageSync('my_loves_need_refresh', 1);
              wx.navigateBack()
            }
          })
        }
      }
    })
  }
})