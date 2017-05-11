Page({
    data: {
        save_loading: 0,
        content: ''
    },
    onLoad: function (options) {
        console.log('badReportInput  options', options)
        let that = this;
        that.setData({
            objectUser_id: options.user_id,
            objectUser_nickname: options.user_nickname,
            comment_id: options.comment_id,
            comment_content: options.comment_content
        })

        let wesecret = wx.getStorageSync('wesecret');
        that.setData({
            wesecret: wesecret
        })

        that.load_badReportTypes();
    },
    load_badReportTypes: function () {
        let that = this;
        wx.request({
            url: 'https://collhome.com/apis/badReportTypes',
            success: function (res) {
                let badReportTypes = res.data.data;
                that.setData({
                    badReportTypes: badReportTypes
                })
            },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    bindBadReportTypeChange: function (e) {
        let that = this;
        that.setData({
            index: e.detail.value
        })
        that.set_loading_status();
    },
    bindContentInput: function (e) {
        let that = this;
        that.setData({
            content: e.detail.value
        })
        that.set_loading_status();
    },
    set_loading_status: function () {
        let that = this;
        if (that.data.index || that.data.content.length > 0) {
            that.setData({
                save_loading: 1
            })
        } else {
            that.setData({
                save_loading: 0
            })
        }
    },
    navigateToProfileShow: function (e) {
        let that = this;
        wx.navigateTo({
            url: '../profileShow/profileShow?user_id=' + that.data.objectUser_id
        })
    },
    submitBadReport: function () {
        let that = this;
        console.log('confirmInput    that.data.comment_id', that.data.comment_id);

        let comment_id = that.data.comment_id;
        wx.request({
            url: `https://collhome.com/apis/comments/${comment_id}/replies`,
            method: 'POST',
            data: {
                wesecret: that.data.wesecret,
                content: that.data.content,
                objectUser_id: that.data.objectUser_id
            },
            success: function (res) {
                console.log('post reply', res.data)
                wx.setStorageSync('love_need_refresh', 1);
                wx.setStorageSync('comment_need_refresh', 1);
                wx.navigateBack()
            }
        })
    }
})