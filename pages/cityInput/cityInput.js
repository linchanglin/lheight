Page({
    data: {},
    onLoad: function (options) {
        let province_id = options.province_id;
        let that = this;
        wx.request({
            url: `https://collhome.com/life/apis/provinces/${province_id}/cities`,
            success: function (res) {
                that.setData({
                    cities: res.data.data
                })
            }
        })
    },
    setCity: function (e) {
        let city_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../collegeInput/collegeInput?city_id=${city_id}`,
        })
    }
})