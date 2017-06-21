import common from '../../utils/common.js';

Page({
    data: {},
    onLoad: function (options) {
        let that = this;
        let my_userInfo = wx.getStorageSync('my_userInfo');
        let genders;
        if (my_userInfo.gender == 1) {
            genders = [
                { name: '男', value: 1, checked: true },
                { name: '女', value: 2 }
            ]
        } else if (my_userInfo.gender == 2) {
            genders = [
                { name: '男', value: 1 },
                { name: '女', value: 2, checked: true }
            ]
        } else {
            genders = [
                { name: '男', value: 1 },
                { name: '女', value: 2 }
            ]
        }
        that.setData({
            radioItems: genders
        })
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);
        let value = e.detail.value;
        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == value;
        }
        this.setData({
            radioItems: radioItems
        });

        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/shanghai/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                userInfo: {
                    gender: parseInt(value)
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