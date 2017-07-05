Page({
    data: {
        save_loading: 0,
        content: '',
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
            url: 'https://collhome.com/fujian-huaqiao/apis/badReportTypes',
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
    navigateToProfileShow: function () {
        let that = this;
        let objectUser_id = that.data.objectUser_id;
        wx.navigateTo({
            url: `../profileShow/profileShow?user_id=${objectUser_id}`,
        })
    },
    submitBadReport: function () {
        let that = this;

        that.setData({
            save_loading: 2
        })

        let url;
        let badReportFrom_id = that.data.badReportFrom_id;
        let badReport_id = that.data.badReport_id;
        let objectUser_id = that.data.objectUser_id;
        if (badReportFrom_id == 1) {
            url = `https://collhome.com/fujian-huaqiao/apis/badReports/love/${badReport_id}`
        } else if (badReportFrom_id == 2) {
            url = `https://collhome.com/fujian-huaqiao/apis/badReports/comment/${badReport_id}`
        } else if (badReportFrom_id == 3) {
            url = `https://collhome.com/fujian-huaqiao/apis/badReports/reply/${badReport_id}`
        } else {
            url = `https://collhome.com/fujian-huaqiao/apis/badReports/user/${objectUser_id}`
        }
        let badReport_type;
        if (that.data.index) {
            badReport_type = parseInt(that.data.index) + 1;
        } else {
            badReport_type = 0
        }
        wx.request({
            url: url,
            method: 'POST',
            data: {
                wesecret: that.data.wesecret,
                badReport_type: badReport_type,
                badReport_content: that.data.content
            },
            success: function (res) {
                wx.showModal({
                    content: '受理成功，谢谢您的举报。',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            wx.navigateBack()
                        }
                    }
                })
                // wx.showToast({
                //     title: '成功',
                //     icon: 'success',
                //     duration: 1000
                // });

                that.setData({
                    save_loading: 1
                })

                // setTimeout(function () {
                //     wx.navigateBack()
                // }, 1000)
            }
        })
    }
})