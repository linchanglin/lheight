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
                userInfo: {
                    college_id: college_id
                }
            },
            success: function (res) {
                wx.setStorageSync('profile_need_refresh', 1);
                common.get_my_userInfo(wesecret).then((user_id) => {
                    wx.navigateBack({
                        delta: 3
                    })
                });
            }
        })

    }
})