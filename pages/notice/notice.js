Page({
    data: {
        page: 1
    },
    onLoad: function () {
        let that = this;
        that.load_notices();
    },
    load_notices: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let page = that.data.page;
        wx.request({
            url: `https://collhome.com/apis/notices?wesecret=${wesecret}&page=${page}`,
            success: function (res) {
                console.log("load_notices res", res);
            }
        })
    }
})