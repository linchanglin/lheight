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
        that.load_notices();
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
            that.load_notices('add_page')
        }
    },
    load_notices: function (parameter) {
        let that = this;
        let wesecret = that.data.wesecret;
        let page = that.data.page;
        wx.request({
            url: `https://collhome.com/shanghai/apis/notices?wesecret=${wesecret}&page=${page}`,
            success: function (res) {
                console.log("load_notices res", res);
                let notices = res.data.data;
                for (let notice of notices) {
                    if (notice.source) {
                        if (notice.source.content.length > 20) {
                            notice.source.content = ':  ' + notice.source.content.substring(0, 20) + '...';
                        } else {
                            notice.source.content = ':  ' + notice.source.content;
                        }
                    }
                }

                if (parameter && parameter == 'add_page') {
                    if (notices.length == 0) {
                        that.setData({
                            reach_bottom: false,
                            page_no_data: true
                        })
                    } else {
                        let new_notices = that.data.notices.concat(notices);
                        that.setData({
                            notices: new_notices,
                            reach_bottom: false,
                            page_no_data: false,
                        })
                    }
                } else {
                    that.setData({
                        notices: notices
                    })
                }

                if (!that.data.notices || that.data.notices.length == 0) {
                    wx.showModal({
                        // title: '提示',
                        showCancel: false,
                        content: '没有提醒',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }

            }
        })
    },
    navigateToProfileShow: function (e) {
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: `../profileShow/profileShow?user_id=${user_id}`
        })
    },
    navigateToProfileShowInSource: function (e) {
        let notice_id = e.currentTarget.dataset.noticeid;
        let notice_source_userInfo_id = e.currentTarget.dataset.noticesourceuserinfoid;
        let that = this;
        that.setData({
            item_selected_notice_id: notice_id,
            item_selected_notice_source_userInfo_id: notice_source_userInfo_id
        })
        setTimeout(function () {
            that.setData({
                item_selected_notice_id: '',
                item_selected_notice_source_userInfo_id: ''
            })
        }, 450)
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: `../profileShow/profileShow?user_id=${notice_source_userInfo_id}`
        })
    },
    navigateToProfileShowInObjectUserInfo: function (e) {
        let notice_id = e.currentTarget.dataset.noticeid;
        let notice_objectUserInfo_Id = e.currentTarget.dataset.noticeobjectuserinfoid;
        let that = this;
        that.setData({
            selected_notice_id: notice_id,
            selected_notice_objectUserInfo_id: notice_objectUserInfo_Id
        })
        setTimeout(function () {
            that.setData({
                selected_notice_id: '',
                selected_notice_objectUserInfo_id: ''
            })
        }, 450)
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: `../profileShow/profileShow?user_id=${notice_objectUserInfo_Id}`
        })
    },
    navigateToSource: function (e) {
        let that = this;
        let notice_ifRead = e.currentTarget.dataset.noticeifread;
        let notice_id = e.currentTarget.dataset.noticeid;
        let source_id = e.currentTarget.dataset.sourceid;
        let source_love_id = e.currentTarget.dataset.sourceloveid;
        let source_comment_id = e.currentTarget.dataset.sourcecommentid;
        let source_type = e.currentTarget.dataset.sourcetype;

        that.setData({
            the_item_selected_notice_id: notice_id
        })
        setTimeout(function () {
            that.setData({
                the_item_selected_notice_id: ''
            })
        }, 450)

        if (source_type == 1) {
            wx.navigateTo({
                url: `../comment/comment?love_id=${source_love_id}`
            });
        } else {
            wx.navigateTo({
                url: `../reply/reply?love_id=${source_love_id}&comment_id=${source_comment_id}`
            });
        }
        if (notice_ifRead == 0) {
            wx.request({
                url: 'https://collhome.com/shanghai/apis/read/notice',
                method: 'POST',
                data: {
                    wesecret: that.data.wesecret,
                    source_id: source_id,
                    source_type: source_type
                },
                success: function (res) {
                    let new_notices = that.data.notices;
                    for (let new_notice of new_notices) {
                        if (new_notice.id == notice_id) {
                            new_notice.if_read = 1
                        }
                    }
                    that.setData({
                        notices: new_notices
                    })
                }
            })
        }
    },
    longtap_notice: function (e) {
        console.log('longtap_notice', e);
        let notice_id = e.currentTarget.dataset.noticeid;
        var that = this;
        that.setData({
            the_item_selected_notice_id: notice_id
        })
    },
    touchmove_notice: function (e) {
        let that = this;
        that.setData({
            the_item_selected_notice_id: ''
        })
    },
})