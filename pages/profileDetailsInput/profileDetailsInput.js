import dataAPI from '../../utils/utils.js'
import common from '../../utils/common.js';

Page({
    data: {
        save_loading: false,

        // region: ['广东省', '广州市', '海珠区']
        region: []
    },
    onLoad: function () {
        let that = this;

        let wesecret = wx.getStorageSync('wesecret');
        that.setData({
            wesecret: wesecret,
        })

        wx.request({
            url: 'https://collhome.com/life/apis/user?wesecret=' + wesecret,
            success: function (res) {
                console.log(res.data)
                let userInfo = res.data.data;
                that.setData({
                    userInfo: userInfo,
                    birthdayIndex: userInfo.birthday
                })
            }
        })
    },
    onShow: function (e) {
        // let that = this;
        // let hometown = wx.getStorageSync('hometown');
        // if (hometown) {
        //     that.setData({
        //         hometown: hometown
        //     });
        //     wx.removeStorageSync('province');
        //     wx.removeStorageSync('hometown');
        // }
    },
    bindBirthdayChange: function (e) {
        this.setData({
            birthdayIndex: e.detail.value
        })
    },
    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },
    formSubmit: function (e) {
        console.log('e', e.detail.value)
        let that = this;
        let submitData = e.detail.value;

        let region = that.data.region;
        // if (submitData.grade != '') {
        //     submitData.grade = parseInt(submitData.grade) + 1;
        // }
        submitData.birthday = that.data.birthdayIndex;
        submitData.hometown = region[0] + ' ' + region[1] + ' ' + region[2];
        // if (that.data.hometown) {
        //     submitData.hometown = that.data.hometown;
        // } else {
        //     if (that.data.userInfo) {
        //         submitData.hometown = that.data.userInfo.hometown;
        //     } else {
        //         submitData.hometown = '';
        //     }
        // }
        console.log("submitData", submitData);

        that.setData({
            save_loading: true
        })

        wx.request({
            url: 'https://collhome.com/life/apis/users',
            data: {
                'wesecret': that.data.wesecret,
                'userInfo': submitData,
            },
            method: 'POST',
            success: function (res) {
                console.log('res', res);
                common.get_my_userInfo(that.data.wesecret).then((user_id) => {
                    that.navigateBackWithSuccess();
                });
            }
        })
    },
    navigateBackWithSuccess: function () {
        let that = this;
        that.setData({
            save_loading: false
        })
        wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
        });
        setTimeout(function () {
            wx.navigateBack();
        }, 1000)
    }
    // navigateToCityMultiPage: function () {
    //     wx.navigateTo({
    //         url: '../city_multi_page/city_multi_page',
    //     })
    // },

});