import common from '../../utils/common.js';

Page({
    data: {},
    onLoad: function () {
        let that = this;
        let my_userInfo = wx.getStorageSync('my_userInfo');
        let genders = [
            { id: 1, name: '男'},
            { id: 2, name: '女'}
        ]
        for (let gender of genders) {
            gender.checked = gender.id == my_userInfo.gender_id;
        }

        that.setData({
            genders: genders
        })
    },
    radioChange: function (e) {
        let gender_id = e.detail.value;
        let that = this;
        let genders = that.data.genders;
        for (let gender of genders) {
            gender.checked = gender.id == gender_id;
        }

        that.setData({
            genders: genders
        });

        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/life/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                userInfo: {
                    gender_id: gender_id
                }
            },
            success: function (res) {
                wx.setStorageSync('profile_need_refresh', 1);
                common.get_my_userInfo(wesecret).then((user_id) => {
                    wx.navigateBack()
                });
            }
        })

    }
})