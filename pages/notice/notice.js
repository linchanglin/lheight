Page({
    data: {
        page: 1,
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
            that.load_replies('add_page')
        }
    },
    load_notices: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        let page = that.data.page;
        wx.request({
            url: `https://collhome.com/apis/notices?wesecret=${wesecret}&page=${page}`,
            success: function (res) {
                console.log("load_notices res", res);
                let notices = res.data.data;
                for (let notice of notices) {
                    if (notice.source.content.length > 20) {
                        notice.source.content = ':  ' + notice.source.content.substring(0, 20) + '...';
                    } else {
                        notice.source.content = ':  ' + notice.source.content;
                    }
                }

                that.setData({
                    notices: notices
                })
            }
        })
    },
    navigateToProfileShow: function (e) {
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: '../profileShow/profileShow?user_id=' + user_id
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
            url: '../profileShow/profileShow?user_id=' + notice_source_userInfo_id
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
            url: '../profileShow/profileShow?user_id=' + notice_objectUserInfo_Id
        })
    },
    navigateToSource: function (e) {
        let type = e.currentTarget.dataset.type;
        let source_love_id = e.currentTarget.dataset.sourceloveid;
        let source_comment_id = e.currentTarget.dataset.sourcecommentid;
        if (type == "comment") {
            wx.navigateTo({
                url: `../comment/comment?love_id=${source_love_id}`
            });
        } else {
            wx.navigateTo({
                url: `../reply/reply?love_id=${source_love_id}&comment_id=${source_comment_id}`
            });
        }
    }
})