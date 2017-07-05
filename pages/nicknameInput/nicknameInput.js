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
    confirmInput: function (e) {
        let value = e.detail.value;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/fujian-huaqiao/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                userInfo: {
                    nickname: value
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