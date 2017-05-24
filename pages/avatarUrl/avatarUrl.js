Page({
    data: {},
    onLoad: function (options) {
        let that = this;
        let avatarUrl = options.avatarUrl;
        that.setData({
            avatarUrl: avatarUrl
        })
    },
})