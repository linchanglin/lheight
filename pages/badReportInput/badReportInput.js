Page({
    data: {
        save_loading: 0,
        content: ''
    },
    onLoad: function (options) {
        console.log('badReportInput  options', options)
        let that = this;
        if (options.love_id) {
            that.setData({
                badReport_id: options.love_id,
                badReport_content: options.love_content,
                badReportFrom: '的表白：',
                badReportFrom_id: 1
            })
        } else if (options.comment_id) {
            that.setData({
                badReport_id: options.comment_id,
                badReport_content: options.comment_content,
                badReportFrom: '的评论：',
                badReportFrom_id: 2
            })
        } else if (options.reply_id) {
            that.setData({
                badReport_id: options.reply_id,
                badReport_content: options.reply_content,
                badReportFrom: '的回复：',
                badReportFrom_id: 3
            })
        } else {
            that.setData({
                badReportFrom: '',
                badReportFrom_id: 0
            })
        }
        that.setData({
            objectUser_id: options.user_id,
            objectUser_nickname: options.user_nickname,
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

        let url;
        let badReportFrom_id = that.data.badReportFrom_id;
        let badReport_id = that.data.badReport_id;
        if (badReportFrom_id == 1) {
            url = `https://collhome.com/apis/badReports/love/${badReport_id}`
        } else if (badReportFrom_id == 2) {
            url = `https://collhome.com/apis/badReports/comment/${badReport_id}`
        } else if (badReportFrom_id == 3) {
            url = `https://collhome.com/apis/badReports/reply/${badReport_id}`
        } else {
            url = `https://collhome.com/apis/badReports/user/${objectUser_id}`
        }
        wx.request({
            url: url,
            method: 'POST',
            data: {
                wesecret: that.data.wesecret,
                badReport_type: that.data.index,
                badReport_content: that.data.content
            },
            success: function (res) {
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 1000
                });
                setTimeout(function () {
                    wx.navigateBack()
                }, 1000)
            }
        })
    }
})