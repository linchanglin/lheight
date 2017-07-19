import common from '../../utils/common.js';

Page({
    data: {
        // 测试用
        test_loves: [
            { id: 1, content: '华侨大学,2018年研究生考生须知因发展需要，我校今年拟撤销计算机科学与技术（081200）、管理科学与工程（120100）一级学科硕士学位授权点，科学社会主义与国际共产主义运动（030203）二级学科博士学位授权点，请各位考生知悉。' },
        ],




    },
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        if (wesecret && my_userInfo) {
            that.setData({
                wesecret: wesecret,
                userInfo: my_userInfo
            })
        }
        // else {
        //     common.signIn().then(() => {
        //         let wesecret = wx.getStorageSync('wesecret');
        //         let my_userInfo = wx.getStorageSync('my_userInfo');
        //         that.setData({
        //             wesecret: wesecret,
        //             userInfo: my_userInfo
        //         })
        //         that.get_unreadNoticeNums();
        //         that.get_unreadSystemNoticeNums();

        //     })
        // }
    },
    onShow: function () {
        let that = this;

        that.get_available();

        let user_need_refresh = wx.getStorageSync('user_need_refresh')
        if (user_need_refresh) {
            let my_userInfo = wx.getStorageSync('my_userInfo');
            that.setData({
                userInfo: my_userInfo
            })
            wx.removeStorageSync('user_need_refresh')
        }
        that.get_unreadNoticeNums();
        that.get_unreadSystemNoticeNums();
    },
    get_available: function () {
        let that = this;
        wx.request({
            url: 'https://collhome.com/fujian-huaqiao/apis/get_available',
            success: function (res) {
                let get_available = res.data.data;
                that.setData({
                    get_available: get_available
                })
            }
        })
    },
    get_unreadNoticeNums: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.request({
                url: `https://collhome.com/fujian-huaqiao/apis/unreadNoticeNums?wesecret=${wesecret}`,
                success: function (res) {
                    console.log('unreadNoticeNums', res);
                    let unreadNoticeNums = res.data.unreadNoticeNums;
                    that.setData({
                        unreadNoticeNums: unreadNoticeNums
                    })
                }
            })
        }
    },
    get_unreadSystemNoticeNums: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.request({
                url: `https://collhome.com/fujian-huaqiao/apis/unreadSystemNoticeNums?wesecret=${wesecret}`,
                success: function (res) {
                    console.log('unreadSystemNoticeNums', res);
                    let unreadSystemNoticeNums = res.data.data.unreadSystemNoticeNums;
                    that.setData({
                        unreadSystemNoticeNums: unreadSystemNoticeNums
                    })
                }
            })
        }
    },
    navigateToRelatedApplet: function () {
        wx.navigateTo({
            url: '../relatedApplet/relatedApplet',
        })
    },
    navigateToManage: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let unreadSystemNoticeNums = that.data.unreadSystemNoticeNums;
        if (wesecret) {
            wx.navigateTo({
                url: `../manage/manage?unreadSystemNoticeNums=${unreadSystemNoticeNums}`,
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: `../manage/manage?unreadSystemNoticeNums=${unreadSystemNoticeNums}`,
                })
            });
        }
    },
    navigateToPraiseMeUsers: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../praiseMeUser/praiseMeUser',
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../praiseMeUser/praiseMeUser',
                })
            });
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
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../profileInput/profileInput',
                })
            });
        }
    },
    navigateToMyCommentLove: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../myCommentLove/myCommentLove',
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../myCommentLove/myCommentLove',
                })
            });
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
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../myLove/myLove',
                })
            });
        }
    },
    navigateToNotice: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../notice/notice',
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../notice/notice',
                })
            });
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
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../message/message',
                })
            });
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
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadSystemNoticeNums();

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
            });
        }
    },
    showNoAvailableModal: function () {
        let that = this;
        let disabled_reason = that.data.userInfo.disabled_reason;
        wx.showModal({
            // title: '不能表白',
            content: `您被禁止发表表白，原因是: ${disabled_reason} 请去 我 -> 我的管理 -> 客服，联系客服解禁，或其他方式联系客服解禁！给您造成不便，谢谢您的谅解！`,
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
            content: '发表表白需要知道您的学校呢，请去 我 -> 个人信息 -> 学校，选择您的学校！',
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