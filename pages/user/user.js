// var app = getApp()

Page({
    data: {},
    onLoad: function () {
        let that = this;

        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            that.setData({
                wesecret: wesecret
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
    navigateToProfile: function () {
        let that = this;
        if (that.data.wesecret) {
            wx.navigateTo({
                url: '../profile/profile',
            })
        } else {
            that.signIn();
        }
    },
    navigateToProfileShow: function () {
        let that = this;
        if (that.data.wesecret) {
            wx.navigateTo({
                url: '../profileShow/profileShow',
            })
        } else {
            that.signIn();
        }
    },
    navigateToProfileShowInput: function () {
        let that = this;
        if (that.data.wesecret) {
            wx.navigateTo({
                url: '../profileShowInput/profileShowInput',
            })
        } else {
            that.signIn();
        }
    },
    navigateToMyLove: function () {
        let that = this;
        if (that.data.wesecret) {
            wx.navigateTo({
                url: '../myLove/myLove',
            })
        } else {
            that.signIn();
        }
    },
    navigateToLoveInput: function () {
        let that = this;
        if (that.data.wesecret) {
            wx.navigateTo({
                url: '../loveInput/loveInput',
            })
        } else {
            that.signIn();
        }
    }
});