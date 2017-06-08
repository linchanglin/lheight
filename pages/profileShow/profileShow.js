import common from '../../utils/common.js';
var app = getApp()

Page({
    data: {
        ifShowAvatarUrl: false
    },
    onLoad: function (option) {
        let that = this;
        let user_id = option.user_id;
        that.setData({
            user_id: user_id
        })
        
        let wh = app.data.deviceInfo.windowHeight - 44;
        that.setData({
            wh: wh
        })

        that.load_user();
    },
    onShareAppMessage: function () {
        let that = this;
        let share_userId = that.data.user_id;
        let share_userNickname = that.data.userInfo.nickName;
        return {
            title: `分享${share_userNickname}`,
            path: `/pages/profileShow/profileShow?user_id=${share_userId}`
        }
    },
    load_user: function () {
        let that = this;
        let user_id = that.data.user_id;
        let wesecret = wx.getStorageSync('wesecret');
        let url;
        if (wesecret) {
            url = `https://collhome.com/apis/users/${user_id}?wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/apis/users/${user_id}?wesecret=`
        }
        wx.request({
            url: url,
            success: function (res) {
                console.log('userInfo', res.data.data)
                that.setData({
                    userInfo: res.data.data
                })
            }
        })
    },
    previewImage: function (e) {
        var that = this;
        console.log('preview e', e);
        var current = e.currentTarget.dataset.current;
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: that.data.userInfo.pictures// 需要预览的图片http链接列表
        })
    },
    showAvatarUrl: function () {
        let that = this;
        that.setData({
            ifShowAvatarUrl: true
        })
    },
    hideAvatarUrl: function () {
        let that = this;
        that.setData({
            ifShowAvatarUrl: false
        })
    },
    praiseUser: function (e) {
        let user_if_my_praise = e.currentTarget.dataset.userifmypraise;
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            common.praiseUser(e).then((user_id) => {
                let old_userInfo = that.data.userInfo;
                old_userInfo.praise_nums = parseInt(old_userInfo.praise_nums);
                if (user_if_my_praise == 0) {
                    old_userInfo.if_my_praise = 1;
                    old_userInfo.praise_nums++
                } else {
                    old_userInfo.if_my_praise = 0
                    old_userInfo.praise_nums--
                }
                that.setData({
                    userInfo: old_userInfo,
                    selected_user_id: user_id
                })
            });
        } else {
            common.signIn();
        }
    },
    navigateToUserMore: function () {
        let that = this;
        let user_id = that.data.userInfo.id;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: `../profileShowMore/profileShowMore?user_id=${user_id}`,
            })
        } else {
            common.signIn();
        }
    }
})