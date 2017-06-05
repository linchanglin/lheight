// pages/adminProfileShow/adminProfileShow.js
Page({
    data: {
    },
    onLoad: function (option) {
        let that = this;
        let user_id = option.user_id;
        that.load_user(user_id);
    },
    load_user: function (user_id) {
        let that = this;
        let url = `https://collhome.com/apis/users/${user_id}?wesecret=`
        wx.request({
            url: url,
            success: function (res) {
                console.log('userInfo', res.data.data)
                that.setData({
                    userInfo: res.data.data
                })
            }
        })
    },
})