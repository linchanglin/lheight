// pages/nicknameInput/nicknameInput.js
Page({
    data: {},
    onLoad: function (options) {
        let that = this;
        let my_userInfo = wx.getStorageSync('my_userInfo');
        that.setData({
            nickName: my_userInfo.nickName
        })
    },
    confirmInput: function (e) {
        let value = e.detail.value;
        wx.request({
            url: '',
        })
    }
})