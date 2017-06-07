Page({
    data: {
        page: 1,
        notices: [
            {
                if_read: 0,
                type: 'comment',
                id: 1,
                content: '评论1架提供丰富的微信原生API，可以方便的调起微信提供的能力，如获取用户信息，本地存储，支付功能等',
                userInfo: {
                    id: 1,
                    nickName: 'nickName1',
                    avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hsTibhnpQPxN0eJPoiaNpPq0HSQzG9XpvmicjAjr0x5f1GcNd7LpHoXMgiadUbd4ibn46HibM5FMXBow/0"
                },
                created_at: '一分钟前',
                source: {
                    love_id: 1,
                    content: '表白1框架提供丰富的微信原生API，可以方便的调起微信提供的能力，如获取用户信息，本地存储，支付功能等。',
                    userInfo: {
                        id: 2,
                        nickName: 'nickName2',
                        avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hsTibhnpQPxN0eJPoiaNpPq0HSQzG9XpvmicjAjr0x5f1GcNd7LpHoXMgiadUbd4ibn46HibM5FMXBow/0"
                    }
                }

            },
            {
                if_read: 1,
                type: 'reply',
                id: 2,
                content: '回复1架提供丰富的微信原生API，可以方便的调起微信提供的能力，如获取用户信息，本地存储，支付功能等',
                userInfo: {
                    id: 2,
                    nickName: 'nickName2',
                    avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hsTibhnpQPxN0eJPoiaNpPq0HSQzG9XpvmicjAjr0x5f1GcNd7LpHoXMgiadUbd4ibn46HibM5FMXBow/0"
                },
                objectUserInfo: {
                    id: 1,
                    nickName: 'nickName1'
                },
                created_at: '一天前',
                source: {
                    comment_id: 1,
                    content: '评论1',
                    userInfo: {
                        id: 3,
                        nickName: 'nickName3',
                        avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hsTibhnpQPxN0eJPoiaNpPq0HSQzG9XpvmicjAjr0x5f1GcNd7LpHoXMgiadUbd4ibn46HibM5FMXBow/0"
                    }
                }
            }
        ]
    },
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        that.setData({
            wesecret: wesecret
        })
        that.load_notices();
    },
    load_notices: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        let page = that.data.page;
        wx.request({
            url: `https://collhome.com/apis/notices?wesecret=${wesecret}&page=${page}`,
            success: function (res) {
                console.log("load_notices res", res);
                // let notices = res.data.data;
                let notices = that.data.notices;
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
    }
})