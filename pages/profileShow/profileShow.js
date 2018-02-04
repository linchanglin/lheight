import common from '../../utils/common.js';
var app = getApp()

Page({
  data: {
    ifShowAvatarUrl: false
  },
  onLoad: function (option) {
    let that = this;
    let user_id = option.user_id;
    that.setData({
      user_id: user_id
      // user_id: 3
    })

    // let wh = app.data.deviceInfo.windowHeight + 3;
    // // let wh = app.data.deviceInfo.windowHeight;
    // that.setData({
    //     wh: wh
    // })

    wx.getSystemInfo({
      success: (res) => {
        let wh = res.windowHeight;
        that.setData({
          wh: wh - 45
        })
      }
    })

    that.load_user();
  },
  onShareAppMessage: function () {
    let that = this;
    let share_userId = that.data.user_id;
    let share_userNickname = that.data.userInfo.nickname;
    return {
      title: `分享${share_userNickname}`,
      path: `/pages/profileShow/profileShow?user_id=${share_userId}`
    }
  },
  load_user: function () {
    let that = this;
    let user_id = that.data.user_id;
    let wesecret = wx.getStorageSync('wesecret');
    let url;
    if (wesecret) {
      url = `https://collhome.com/life/apis/users/${user_id}?wesecret=${wesecret}`
    } else {
      url = `https://collhome.com/life/apis/users/${user_id}?wesecret=`
    }
    wx.request({
      url: url,
      success: function (res) {
        console.log('userInfo', res.data.data)
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
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: that.data.userInfo.pictures// 需要预览的图片http链接列表
    })
  },
  showAvatarUrl: function () {
    let that = this;
    that.setData({
      ifShowAvatarUrl: true
    })
  },
  hideAvatarUrl: function () {
    let that = this;
    that.setData({
      ifShowAvatarUrl: false
    })
  },
  praiseUser: function (e) {
    let user_if_my_praise = e.currentTarget.dataset.userifmypraise;
    let that = this;
    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      common.praiseUser(e).then((user_id) => {
        let old_userInfo = that.data.userInfo;
        old_userInfo.praise_nums = parseInt(old_userInfo.praise_nums);
        if (user_if_my_praise == 0) {
          old_userInfo.if_my_praise = 1;
          old_userInfo.praise_nums++
        } else {
          old_userInfo.if_my_praise = 0
          old_userInfo.praise_nums--
        }
        that.setData({
          userInfo: old_userInfo,
          selected_user_id: user_id
        })
      });
    } else {
      common.signIn().then(() => {
        common.praiseUser(e).then((user_id) => {
          let old_userInfo = that.data.userInfo;
          old_userInfo.praise_nums = parseInt(old_userInfo.praise_nums);
          if (user_if_my_praise == 0) {
            old_userInfo.if_my_praise = 1;
            old_userInfo.praise_nums++
          } else {
            old_userInfo.if_my_praise = 0
            old_userInfo.praise_nums--
          }
          that.setData({
            userInfo: old_userInfo,
            selected_user_id: user_id
          })
        });
      });
    }
  },
  navigateToUserMore: function () {
    let that = this;
    let user_id = that.data.userInfo.id;
    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      wx.navigateTo({
        url: `../profileShowMore/profileShowMore?user_id=${user_id}`,
      })
    } else {
      common.signIn().then(() => {
        wx.navigateTo({
          url: `../profileShowMore/profileShowMore?user_id=${user_id}`,
        })
      });
    }
  },






  navigateToMessageInput: function () {
    let that = this;
    let userid = that.data.userInfo.id
    let openid = that.data.userInfo.openid;
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




  saveFormid: function (e) {
    console.log('saveFormid e', e);
    let that = this;
    let form_id = e.detail.formId;
    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      let data = {
        wesecret: wesecret,
        form_id, form_id
      }
      wx.request({
        url: 'https://collhome.com/life/apis/templateMessages',
        method: 'POST',
        data: data,
        success: function (res) {
          console.log('saveFormid res', res);
        }
      })
    }
  },
})