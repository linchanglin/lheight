import common from '../../utils/common.js';

Page({
    data: {},
    onLoad: function (option) {
        console.log('option', option);
        let interest_id = option.interest_id;
        let that = this;

        wx.request({
            url: 'https://collhome.com/life/apis/interests',
            success: function (res) {
                let interests = res.data.data;
                for (let interest of interests) {
                    interest.checked = interest.id == interest_id;
                }
                that.setData({
                    interests: interests
                })
            }
        })
    },
    radioChange: function (e) {
        let interest_id = e.detail.value;
        let that = this;
        let interests = that.data.interests;

        for (let interest of interests) {
            interest.checked = interest.id == interest_id;
        }

        that.setData({
            interests: interests
        });

        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/life/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                userInfo: {
                    interest_id: interest_id
                }
            },
            success: function (res) {
                wx.setStorageSync('profile_need_refresh', 1);

                wx.setStorageSync('love_need_refresh_for_interest_changed', 1);
                wx.setStorageSync('activity_need_refresh_for_interest_changed', 1);
                wx.setStorageSync('question_need_refresh_for_interest_changed', 1);
                wx.setStorageSync('find_need_refresh_for_interest_changed', 1);

                common.get_my_userInfo(wesecret).then((user_id) => {
                    wx.navigateBack()
                });
            }
        })
    }
})