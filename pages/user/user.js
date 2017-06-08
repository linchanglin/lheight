Page({
    data: {},
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            that.setData({
                wesecret: wesecret
            })
            that.get_userInfo();
            that.get_unreadNoticeNums();
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
                that.get_userInfo();
                that.get_unreadNoticeNums();
            }
        })
    },
    get_userInfo: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        wx.request({
            url: `https://collhome.com/apis/user?wesecret=${wesecret}`,
            success: function (res) {
                console.log('userInfo', res.data.data)
                wx.setStorageSync('my_userInfo', res.data.data);
                that.setData({
                    userInfo: res.data.data
                })
            }
        })
    },
    get_unreadNoticeNums: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        wx.request({
            url: `https://collhome.com/apis/unreadNoticeNums?wesecret=${wesecret}`,
            success: function (res) {
                console.log('unreadNoticeNums', res);
                let unreadNoticeNums = res.data.unreadNoticeNums;
                that.setData({
                    unreadNoticeNums: unreadNoticeNums
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
    navigateToManage: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        if (wesecret) {
            wx.navigateTo({
                url: '../manage/manage',
            })
        } else {
            that.signIn();
        }
    },
    navigateToPraiseMeUsers: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        if (wesecret) {
            wx.navigateTo({
                url: '../praiseMeUser/praiseMeUser',
            })
        } else {
            that.signIn();
        }
    },
    navigateToProfileInput: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        if (wesecret) {
            wx.navigateTo({
                url: '../profileInput/profileInput',
            })
        } else {
            that.signIn();
        }
    },
    navigateToMyLove: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        if (wesecret) {
            wx.navigateTo({
                url: '../myLove/myLove',
            })
        } else {
            that.signIn();
        }
    },
    navigateToNotice: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        if (wesecret) {
            wx.navigateTo({
                url: '../notice/notice',
            })
        } else {
            that.signIn();
        }
    },
    // navigateToMessage: function () {
    //     let that = this;
    //     let wesecret = that.data.wesecret;
    //     if (wesecret) {
    //         wx.navigateTo({
    //             url: '../message/message',
    //         })
    //     } else {
    //         that.signIn();
    //     }
    // },
    navigateToPrivateLetter: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        if (wesecret) {
            wx.navigateTo({
                url: '../privateLetter/privateLetter',
                // url: '../message/message',
            })
        } else {
            that.signIn();
        }
    },
    navigateToLoveInput: function () {
        let that = this;
        let wesecret = that.data.wesecret;
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
            that.signIn();
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