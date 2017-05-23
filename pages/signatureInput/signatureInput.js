import common from '../../utils/common.js';

Page({
  data:{},
  confirmInput: function (e) {
      let value = e.detail.value;
      let wesecret = wx.getStorageSync('wesecret');
      wx.request({
          url: 'https://collhome.com/apis/users',
          method: 'POST',
          data: {
              wesecret: wesecret,
              nickName: value
          },
          success: function (res) {
              wx.setStorageSync('profile_need_refresh', 1);
              common.get_my_userInfo(wesecret);
              wx.navigateBack()
          }
      })
  }
})