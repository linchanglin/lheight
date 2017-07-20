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
        wx.setStorageSync('interest_id', interest_id);

        let that = this;
        let interests = that.data.interests;

        for (let interest of interests) {
            interest.checked = interest.id == interest_id;
        }

        that.setData({
            interests: interests
        });

        wx.navigateBack();
    }
})