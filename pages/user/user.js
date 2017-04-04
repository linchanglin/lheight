// var app = getApp()

Page({
    data: {},
    onLoad: function () {
        let that = this;

        let wesecret = wx.getStorageSync('wesecret');
        let userInfo = wx.getStorageSync('userInfo');
        if (wesecret && userInfo) {
            that.setData({
                wesecret: wesecret,
                userInfo: userInfo
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
                                        wx.request({
                                            url: 'https://collhome.com/api/register',
                                            method: 'POST',
                                            data: {
                                                code: code,
                                                encryptedData: res.encryptedData,
                                                iv: res.iv
                                            },
                                            success: function (res) {
                                                console.log('res',  res)
                                                console.log('res.data',  res.data)
                                                console.log('typeof res.data',  typeof res.data)
                                                console.log('post_return_data.data.wesecret', res_data.data.wesecret)
                                                console.log('post_return_data.data.userInfo', res_data.data.userInfo)

                                                wx.setStorageSync('wesecret', res.data.wesecret);
                                                wx.setStorageSync('userInfo', res.data.userInfo);
                                                that.setData({
                                                    wesecret: res.data.wesecret,
                                                    userInfo: res.data.userInfo
                                                })
                                            }
                                        })
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
    navigateToProfile: function () {
        let that = this;
        if (that.data.wesecret && that.data.userInfo) {
            wx.navigateTo({
                url: '../profile/profile',
            })
        } else {
            that.signIn();
        }
    },
    navigateToProfileShow: function () {
        let that = this;
        if (that.data.wesecret && that.data.userInfo) {
            wx.navigateTo({
                url: '../profileShow/profileShow',
            })
        } else {
            that.signIn();
        }
    },
    navigateToProfileShowInput: function () {
        let that = this;
        if (that.data.wesecret && that.data.userInfo) {
            wx.navigateTo({
                url: '../profileShowInput/profileShowInput',
            })
        } else {
            that.signIn();
        }
    },
    navigateToMyLove: function () {
        let that = this;
        if (that.data.wesecret && that.data.userInfo) {
            wx.navigateTo({
                url: '../myLove/myLove',
            })
        } else {
            that.signIn();
        }
    },
    navigateToLoveInput: function () {
        let that = this;
        if (that.data.wesecret && that.data.userInfo) {
            wx.navigateTo({
                url: '../loveInput/loveInput',
            })
        } else {
            that.signIn();
        }
    }
});