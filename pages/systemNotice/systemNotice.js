// pages/systemNotice/systemNotice.js
Page({
    data: {
        page: 1,
        reach_bottom: false,
        page_no_data: false,
    },
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        that.setData({
            wesecret: wesecret
        })
        that.load_systemNotices('onLoad');
    },
    onReachBottom: function () {
        console.log('onReachBottom')
        let that = this;
        if (!that.data.page_no_data) {
            that.setData({
                reach_bottom: true,
                page_no_data: false,
                page: that.data.page + 1
            })
            that.load_systemNotices('add_page')
        }
    },
    load_systemNotices: function (parameter) {
        let that = this;
        let wesecret = that.data.wesecret;
        let page = that.data.page;
        wx.request({
            url: `https://collhome.com/life/apis/systemNotices?wesecret=${wesecret}&page=${page}`,
            success: function (res) {
                console.log("load_systemNotices res", res);
                let systemNotices = res.data.data;

                if (parameter && parameter == 'add_page') {
                    if (systemNotices.length == 0) {
                        that.setData({
                            reach_bottom: false,
                            page_no_data: true
                        })
                    } else {
                        let new_systemNotices = that.data.systemNotices.concat(systemNotices);
                        that.setData({
                            systemNotices: new_systemNotices,
                            reach_bottom: false,
                            page_no_data: false,
                        })
                    }
                } else {
                    that.setData({
                        systemNotices: systemNotices
                    })
                }

                if (parameter && parameter == 'onLoad') {
                    if (systemNotices.length > 0) {
                        let systemNotice_id = systemNotices[0].id;
                        wx.request({
                            url: 'https://collhome.com/life/apis/read/systemNotice',
                            method: 'post',
                            data: {
                                wesecret: wesecret,
                                systemNotice_id: systemNotice_id
                            },
                            success: function (res) {
                                console.log('successs', res);
                            }
                        })
                    }
                }
            }
        })
    },
    previewImage: function (e) {
        console.log('preview e', e);
        let current = e.currentTarget.dataset.current;
        let urls = [];
        urls.push(current);

        wx.previewImage({
            current: current,
            urls: urls
        })
    },
})