import common from '../../utils/common.js';

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
            url: 'https://collhome.com/apis/register',
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
    getUserInfo: function (wesecret) {
        let that = this;
        wx.request({
            url: 'https://collhome.com/apis/user?wesecret=' + wesecret,
            success: function (res) {
                console.log('userInfoooo', res.data.data)
                wx.setStorageSync('my_userInfo', res.data.data);
                that.setData({
                    userInfo: res.data.data
                })
            }
        })
    },
    onShow: function () {
        let that = this;
        let user_need_refresh = wx.getStorageSync('user_need_refresh')
        if (user_need_refresh) {
            let my_userInfo = wx.getStorageSync('my_userInfo');
            that.setData({
                userInfo: my_userInfo
            })
            wx.removeStorageSync('user_need_refresh')
        }
    },
    onShareAppMessage: function () {
        return {
            title: '我',
            path: '/pages/user/user'
        }
    },
    navigateToProfile: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../profile/profile',
            })
        } else {
            common.signIn();
        }
    },
    navigateToProfileInput: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../profileInput/profileInput',
            })
        } else {
            common.signIn();
        }
    },
    navigateToMyLove: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../myLove/myLove',
            })
        } else {
            common.signIn();
        }
    },
    navigateToMessage: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../message/message',
            })
        } else {
            common.signIn();
        }
    },
    navigateToLoveInput: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            let userInfo = that.data.userInfo;
            if (userInfo.available == 0) {
                that.showNoAvailableModal();
            } else {
                if (that.data.userInfo.college == '') {
                    that.showNoCollegeModal();
                } else {
                    wx.navigateTo({
                        url: '../loveInput/loveInput',
                    })
                }
            }
        } else {
            common.signIn();
        }
    },
    showNoAvailableModal: function () {
        let that = this;
        wx.showModal({
            // title: '不能表白',
            content: '您有不当言论，被禁止发表表白，详情请联系管理员！',
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
            title: '未知学校',
            content: '发表表白需要知道您的学校呢，请去 我 -> 个人信息 -> 学校 选择您的学校！',
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