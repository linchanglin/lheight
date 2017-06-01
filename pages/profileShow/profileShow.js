import common from '../../utils/common.js';

Page({
    data: {
        ifShowAvatarUrl: false
    },
    onLoad: function (option) {
        let that = this;
        if (option.user_id) {
            that.load_user(option.user_id);
        } else {
            that.load_user();
        }
        wx.getSystemInfo({
            success: (res) => {
                let wh = res.windowHeight;
                that.setData({
                    wh: wh - 44
                })
            }
        })
    },
    load_user: function (user_id) {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let url;
        if (user_id) {
            url = 'https://collhome.com/apis/users/' + user_id
        } else {
            url = 'https://collhome.com/apis/user?wesecret=' + wesecret
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
        wx.navigateTo({
            url: `../profileShowMore/profileShowMore?user_id=${user_id}`,
        })
    }
})