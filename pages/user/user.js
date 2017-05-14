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
            that.getUserInfo(wesecret);
        } else {
            that.signIn();
        }
    },
    onShow: function () {
        let that = this;
        let user_need_refresh = wx.getStorageSync('user_need_refresh')
        if (user_need_refresh) {
            that.getUserInfo(that.data.wesecret);
            wx.removeStorageSync('user_need_refresh')
        }
    },
    getUserInfo: function (wesecret) {
        let that = this;
        wx.request({
            url: 'https://collhome.com/shangongyuan/api/user?wesecret=' + wesecret,

            success: function (res) {
                console.log('userInfo', res.data)

                that.setData({
                    userInfo: res.data.data
                })
            }
        })
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
            url: 'https://collhome.com/shangongyuan/api/register',
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

                that.getUserInfo(res.data);
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
            if (that.data.userInfo.college === '') {
                that.showNoCollegeModal();
            } else {
                wx.navigateTo({
                    url: '../loveInput/loveInput',
                })
            }
        } else {
            that.signIn();
        }
    },
    showNoCollegeModal: function () {
        let that = this;
        wx.showModal({
            title: '未知校区',
            content: '发表表白需要知道您的校区呢，请去 修改信息 -> 校区 选择您的校区！',
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