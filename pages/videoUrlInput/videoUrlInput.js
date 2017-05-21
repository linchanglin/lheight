// pages/videoUrlInput/videoUrlInput.js
Page({
    data: {
        video_url: ''
    },
    onLoad: function (option) {
        console.log('option', option);
        let that = this;

        if (option.video_url) {
            that.setData({
                video_url: option.video_url
            })
        }
    },
    bindContentInput: function (e) {
        let that = this;
        let value = e.detail.value;
        that.setData({
            video_url: value
        })
    },
    confirmInput: function () {
        let that = this;
        let video_url = that.data.video_url;
        wx.setStorageSync('video_url', video_url);
        wx.navigateBack();
    }
})