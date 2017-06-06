Page({
    data: {
        page: 1,
        notices: [
            {
                if_read: 0,
                type: 'comment',
                id: 1,
                content: '评论1',
                userInfo: {
                    id: 1,
                    nickName: 'nickName1',
                    avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hsTibhnpQPxN0eJPoiaNpPq0HSQzG9XpvmicjAjr0x5f1GcNd7LpHoXMgiadUbd4ibn46HibM5FMXBow/0"
                },
                created_at: '一分钟前',
                source: {
                    love_id: 1,
                    content: '表白1',
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
                content: '回复1',
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
                // that.setData({
                //     notices: res.data.data
                // })
            }
        })
    }
})