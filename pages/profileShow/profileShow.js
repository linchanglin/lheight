Page({
    data: {},
    onLoad: function (option) {
        let that = this;
        if (option.user_id) {
            that.load_user(option.user_id);
        } else {
            that.load_user();
        }
        wx.getSystemInfo({
            success: (res) => {
                let ww = res.windowWidth;
                var length = 3;
                var row = Math.ceil(length / 3);
                var line = Math.ceil(length / row);
                var widthM = ww - 20;
                var widthX = (widthM / line).toFixed(2) - 6;
                var margin = "3px";
                that.setData({
                    imgCss: {
                        width: widthX + 'px',
                        height: widthX + 'px',
                        margin: margin
                    }
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
    // editProfileShow: function () {
    //   wx.navigateTo({
    //     url: '../profileShowInput/profileShowInput'
    //   })
    // }
})