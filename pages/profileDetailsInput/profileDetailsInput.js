import common from '../../utils/common.js';

Page({
    data: {
        save_loading: false,

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
        submitData.birthday = that.data.birthdayIndex;
        submitData.hometown = region[0] + ' ' + region[1] + ' ' + region[2];
        
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
});