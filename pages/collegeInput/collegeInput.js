import common from '../../utils/common.js';

Page({
    data: {},
    onLoad: function (options) {
        let city_id = options.city_id;
        let that = this;
        let my_userInfo = wx.getStorageSync('my_userInfo');
        wx.request({
            url: `https://collhome.com/life/apis/cities/${city_id}/colleges`,
            success: function (res) {
                let colleges = res.data.data;
                for (let college of colleges) {
                    college.checked = college.id == my_userInfo.college_id;
                }
                that.setData({
                    colleges: colleges
                })
            }
        })
    },
    radioChange: function (e) {
        let college_id = e.detail.value;
        let that = this;
        let colleges = that.data.colleges;
        for (let college of colleges) {
            college.checked = college.id == college_id;
        }

        that.setData({
            colleges: colleges
        });

        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/life/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                just_college_changed: 1,
                userInfo: {
                    college_id: college_id
                }
            },
            success: function (res) {
                wx.setStorageSync('profile_need_refresh', 1);

                if (res.data.need_refresh_loves == 1) {
                    wx.setStorageSync('love_need_refresh_for_interest_changed', 1);
                    wx.setStorageSync('activity_need_refresh_for_interest_changed', 1);
                    wx.setStorageSync('question_need_refresh_for_interest_changed', 1);
                    wx.setStorageSync('find_need_refresh_for_interest_changed', 1);
                }

                common.get_my_userInfo(wesecret).then((user_id) => {
                    wx.navigateBack({
                        delta: 3
                    })
                });
            }
        })

    }
})