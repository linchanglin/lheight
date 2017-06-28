import common from '../../utils/common.js';

Page({
    data: {},
    onLoad: function (options) {
        let that = this;
        let my_userInfo = wx.getStorageSync('my_userInfo');
        wx.request({
            url: 'https://collhome.com/shandong-nongyegongcheng/apis/colleges',
            success: function (res) {
                console.log('colleges res', res);
                let originColleges = res.data.data;
                let colleges = [];
                for (let i = 0; i < originColleges.length; i++) {
                    let college_element = {
                        name: originColleges[i],
                        value: i,
                        checked: originColleges[i] == my_userInfo.college_name
                    }
                    colleges.push(college_element)
                }
                that.setData({
                    radioItems: colleges
                })
            }
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
            url: 'https://collhome.com/shandong-nongyegongcheng/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                userInfo: {
                    college: parseInt(value) + 1
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