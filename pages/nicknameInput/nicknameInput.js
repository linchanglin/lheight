import common from '../../utils/common.js';

Page({
    data: {},
    onLoad: function (options) {
        let that = this;
        let my_userInfo = wx.getStorageSync('my_userInfo');
        that.setData({
            nickname: my_userInfo.nickname
        })
    },
    bindContentInput: function (e) {
        let that = this;
        let value = e.detail.value;
        that.setData({
            nickname: value
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
    confirmInput: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/life/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                userInfo: {
                    nickname: that.data.nickname
                }
            },
            success: function (res) {
                wx.setStorageSync('profile_need_refresh', 1);
                common.get_my_userInfo(wesecret).then((user_id) => {
                    wx.navigateBack()
                });
            }
        })
    }
})