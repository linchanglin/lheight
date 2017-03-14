var app = getApp()

Page({
    data: {
        userInfo: {}
    },
    onLoad: function () {
        let that = this;

        app.getUserInfo(function (userInfo) {
            console.log('uerInfo', userInfo);
            that.setData({
                userInfo: userInfo
            })
        })
    }
});