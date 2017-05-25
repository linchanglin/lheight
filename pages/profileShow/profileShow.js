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
    }
})