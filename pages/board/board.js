
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
      console.log('that.data.wesecret', that.data.wesecret);
      wx.request({
        url: 'https://collhome.com/api/loves?wesecret=' + that.data.wesecret,
        success: function (res) {
          console.log(res.data)

          let loves = res.data.data;

          that.setData({
            loves: loves
          })
        }
      })
    } else {
      wx.request({
        url: 'https://collhome.com/api/loves',
        success: function (res) {
          console.log(res.data)

          let loves = res.data.data;

          that.setData({
            loves: loves
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

  navigateToLove: function (e) {
    console.log('navigateToLove', e);
    let love_id = e.currentTarget.dataset.loveid;
    console.log('love_id', love_id);

    var that = this;

    // setTimeout(function () {
    //   that.setData({
    //     hoverClass: 'weui-cell_active'
    //   })
    // }, 50)
    // setTimeout(function () {
    //   that.setData({
    //     hoverClass: ''
    //   })
    // }, 450)
    wx.navigateTo({
      url: '../comment/comment?love_id=' + love_id
    });
  },
  navigateToComment: function (e) {
    console.log('navigateToComment', e);
    let love_id = e.currentTarget.dataset.loveid;
    let comment_nums = e.currentTarget.dataset.commentnums;

    var that = this;
    if (comment_nums == 0) {

      if (that.data.wesecret) {
        wx.navigateTo({
          url: '../commentInput/commentInput?love_id=' + love_id
        });
      } else {
        that.signIn();
      }


    } else {
      wx.navigateTo({
        url: '../comment/comment?love_id=' + love_id
      });
    }
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
        url: 'https://collhome.com/api/loves/' + love_id + '/praises',
        method: 'POST',
        data: {
          wesecret: that.data.wesecret,
          praise: praise
        },
        success: function (res) {
          console.log('1231654', res.data)

          let old_loves = that.data.loves;
          for (let value of old_loves) {
            if (value.id == love_id) {
              value.praise_nums = parseInt(value.praise_nums);
              if (love_if_my_praise == 0) {
                value.if_my_praise = 1;
                value.praise_nums++
              } else {
                value.if_my_praise = 0
                value.praise_nums--
              }
            }
          }
          that.setData({
            loves: old_loves
          })
          that.setData({
            selected_love_id: love_id
          })
          setTimeout(function () {

            that.setData({
              rippleName: "bounceIn"
            });
          }, 3000)

          setTimeout(function () {
            that.setData({
              rippleName: ""
            });
          }, 6000)

        }
      })

    } else {
      that.signIn();
    }



    if (that.data.length == 0) {
      that.setData({
        length: 1
      })
    } else {
      that.setData({
        length: 0
      })
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
      url: 'https://collhome.com/api/register',
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
      }
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
