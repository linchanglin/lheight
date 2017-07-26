// pages/manage/manage.js
Page({
    data: {
        canIUseContact: wx.canIUse('button.open-type.contact')
    },
    onLoad: function (options) {
        let that = this;
        let unreadSystemNoticeNums = options.unreadSystemNoticeNums;
        that.setData({
            unreadSystemNoticeNums: unreadSystemNoticeNums
        })
    },
    // navigateToBlackList: function () {
    //     wx.navigateTo({
    //         url: '../blackList/blackList',
    //     })
    // },
    navigateToAboutLoveWall: function () {
        wx.navigateTo({
            url: '../aboutLoveWall/aboutLoveWall',
        })
    },
    onShareAppMessage: function () {
        let that = this;
        return {
            title: `分享校园生活墙`,
            path: `/pages/love/love`,
            success: function (res) {
                console.log("onShareAppMessage", res);
            }
        }
    },
    navigateToSystemNotice: function () {
        wx.navigateTo({
            url: '../systemNotice/systemNotice',
        })
    },
    signOut: function () {
        wx.showActionSheet({
            itemList: ['退出登录'],
            itemColor: '#ff0000',
            success: function (res) {
                console.log(res.tapIndex)
                if (res.tapIndex == 0) {
                    wx.removeStorageSync('wesecret');
                    wx.setStorageSync('my_userInfo', {});
                    wx.setStorageSync('user_need_refresh', 1);

                    wx.navigateBack()
                }
            }
        })
    }
})