// 从find.js 复制过来  只是去掉了 video 和 改了 let type = 'commentLoves'; let type = 'praiseLoves'; 还有 find 改为 mycomment;

// import common from '../../utils/common.js';
// var app = getApp()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["收信箱", "已发送"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,


    hot_loves: [],
    image_loves: [],


    hot_page: 1,
    hot_reach_bottom: false,
    hot_page_no_data: false,
    image_page: 1,
    image_reach_bottom: false,
    image_page_no_data: false,


  },
  tabClick: function (e) {
    let that = this;

    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onLoad: function () {
    let that = this;

    wx.getSystemInfo({
      success: function (res) {
        console.log('systemInfo', res);
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
      }
    });


    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      that.setData({
        wesecret: wesecret
      })
    }
    wx.showLoading({
      title: '加载中',
    })

    that.load_hotLoves('onLoad');
    that.load_imageLoves('onLoad');
  },

  onReachBottom: function () {
    let that = this;
    let activeIndex = that.data.activeIndex;
    console.log('onReachBottom activeIndex', activeIndex);
    if (activeIndex == 0) {
      if (!that.data.hot_page_no_data) {
        that.setData({
          hot_reach_bottom: true,
          hot_page_no_data: false,
          hot_page: that.data.hot_page + 1
        })
        that.load_hotLoves('add_page')
      }
    } else {
      if (!that.data.image_page_no_data) {
        that.setData({
          image_reach_bottom: true,
          image_page_no_data: false,
          image_page: that.data.image_page + 1
        })
        that.load_imageLoves('add_page')
      }
    }
  },

  load_hotLoves: function (parameter) {
    let that = this;
    let hot_page;
    if (parameter == 'add_page') {
      hot_page = that.data.hot_page;
    } else {
      hot_page = 1;
      that.setData({
        hot_page: 1,
        hot_reach_bottom: false,
        hot_page_no_data: false
      })
    }
    let wesecret = wx.getStorageSync('wesecret');
    let type = 1;
    let url;
    if (wesecret) {
      url = `https://collhome.com/life/apis/get_private_messages?type=${type}&page=${hot_page}&wesecret=${wesecret}`
    } else {
      url = `https://collhome.com/life/apis/get_private_messages?type=${type}&page=${hot_page}&wesecret=`
    }
    wx.request({
      url: url,
      success: function (res) {
        console.log('loves', res.data);
        let loves = res.data.data;
        if (parameter == 'add_page') {
          console.log("loves.length", loves.length)
          if (loves.length == 0) {
            that.setData({
              hot_reach_bottom: false,
              hot_page_no_data: true
            })
          } else {
            let new_loves = that.data.hot_loves.concat(loves);
            that.setData({
              hot_loves: new_loves
            })
            that.setData({
              hot_reach_bottom: false,
              hot_page_no_data: false

            })
          }
        } else {
          that.setData({
            hot_loves: loves
          })
        }
        if (parameter == 'pulldown' || parameter == 'onLoad') {
          wx.stopPullDownRefresh();
          wx.hideLoading()
        }
      }
    })

  },
  load_imageLoves: function (parameter) {
    let that = this;
    let image_page;
    if (parameter == 'add_page') {
      image_page = that.data.image_page;
    } else {
      image_page = 1;
      that.setData({
        image_page: 1,
        image_reach_bottom: false,
        image_page_no_data: false
      })
    }
    let wesecret = wx.getStorageSync('wesecret');
    let type = 2;
    let url;
    if (wesecret) {
      url = `https://collhome.com/life/apis/get_private_messages?type=${type}&page=${image_page}&wesecret=${wesecret}`
    } else {
      url = `https://collhome.com/life/apis/get_private_messages?type=${type}&page=${image_page}&wesecret=`
    }
    wx.request({
      url: url,
      success: function (res) {
        console.log('loves', res.data);
        let loves = res.data.data;
        if (parameter == 'add_page') {
          console.log("loves.length", loves.length)
          if (loves.length == 0) {
            that.setData({
              image_reach_bottom: false,
              image_page_no_data: true
            })
          } else {
            let new_loves = that.data.image_loves.concat(loves);
            that.setData({
              image_loves: new_loves
            })
            that.setData({
              image_reach_bottom: false,
              image_page_no_data: false

            })
          }
        } else {
          that.setData({
            image_loves: loves
          })
        }
        if (parameter == 'pulldown' || parameter == 'onLoad') {
          wx.stopPullDownRefresh();
          wx.hideLoading()
        }
      }
    })

  },
  navigateToProfileShow: function (e) {
    console.log('navigateToProfileShow', e);
    let that = this;
    let user_id = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../profileShow/profileShow?user_id=' + user_id
    })
  },
  set_showActionSheet: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['全部已读'],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.read_all_messages();
        }
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  read_all_messages: function () {
    let that = this;
    wx.request({
      url: 'https://collhome.com/life/apis/read_all/private_messages',
      method: 'POST',
      data: {
        wesecret: that.data.wesecret,
      },
      success: function (res) {
        let messages = that.data.hot_loves;
        for (let message of messages) {
          message.if_read = 1
        }
        that.setData({
          hot_loves: messages
        })
      }
    })
  },








  showActionSheet: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let content = e.currentTarget.dataset.content;
    let userid = e.currentTarget.dataset.userid;
    let openid = e.currentTarget.dataset.openid;

    that.readMessage(id);

    wx.showActionSheet({
      itemList: [content, '回信'],
      success: function (res) {
        if (res.tapIndex == 1) {
          that.navigateToMessageInput(userid, openid);
        }
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  readMessage: function (id) {
    let that = this;
    let wesecret = wx.getStorageSync('wesecret');
    wx.request({
      url: 'https://collhome.com/life/apis/read/private_message',
      method: 'POST',
      data: {
        wesecret: wesecret,
        id: id
      },
      success: function (res) {
        let loves = that.data.hot_loves;
        for (let love of loves) {
          if (love.id == id) {
            love.if_read = 1
          }
        }
        that.setData({
          hot_loves: loves
        })
      }
    })
  },
  navigateToMessageInput: function (userid, openid) {
    let that = this;
    let wesecret = wx.getStorageSync('wesecret');
    let my_userInfo = wx.getStorageSync('my_userInfo');
    if (wesecret && my_userInfo) {
      if (my_userInfo.available == 0) {
        that.showNoAvailableModal();
      } else if (my_userInfo.college_id == '') {
        that.showNoCollegeModal();
      } else if (my_userInfo.pictures.length < 1 || my_userInfo.realname == '' || my_userInfo.birthday == '' || my_userInfo.hometown == '' || my_userInfo.major == '' || my_userInfo.grade == '' || my_userInfo.wechat == '' || my_userInfo.hobby == '' || my_userInfo.love_selecting == '') {
        that.showNoProfileModal();
      } else {
        wx.navigateTo({
          url: `../messageInput/messageInput?openid=${openid}&userid=${userid}`,
        })
      }
    } else {
      common.signIn().then(() => {
        let my_userInfo = wx.getStorageSync('my_userInfo');
        if (my_userInfo.available == 0) {
          that.showNoAvailableModal();
        } else if (my_userInfo.college_id == '') {
          that.showNoCollegeModal();
        } else if (my_userInfo.pictures.length < 1 || my_userInfo.realname == '' || my_userInfo.birthday == '' || my_userInfo.hometown == '' || my_userInfo.major == '' || my_userInfo.grade == '' || my_userInfo.wechat == '' || my_userInfo.hobby == '' || my_userInfo.love_selecting == '') {
          that.showNoProfileModal();
        } else {
          wx.navigateTo({
            url: `../messageInput/messageInput?openid=${openid}&userid=${userid}`,
          })
        }
      });
    }
  },
  showNoAvailableModal: function () {
    let that = this;
    let my_userInfo = wx.getStorageSync('my_userInfo');
    let disabled_reason = my_userInfo.disabled_reason;
    wx.showModal({
      content: `您被禁止发送私信，原因是: ${disabled_reason} 请去 我 -> 我的管理 -> 客服，联系客服解禁，或其他方式联系客服解禁！给您造成不便，谢谢您的谅解！`,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showNoCollegeModal: function () {
    let that = this;
    wx.showModal({
      title: '未完善学校信息',
      content: '发送私信需要知道您的学校呢，请去 我 -> 个人信息 -> 学校，选择您的学校！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showNoProfileModal: function () {
    let that = this;
    wx.showModal({
      title: '未完善眼缘信息',
      content: '发送私信需要完善您的眼缘信息呢，请去 我 -> 个人信息 -> 眼缘信息，完善您的眼缘信息！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


});