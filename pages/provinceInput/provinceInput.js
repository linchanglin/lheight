Page({
    data: {},
    onLoad: function () {
        let that = this;
        wx.request({
            url: 'https://collhome.com/life/apis/provinces',
            success: function (res) {
                that.setData({
                    provinces: res.data.data
                })
            }
        })
    },
    setProvice: function (e) {
        let province_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../cityInput/cityInput?province_id=${province_id}`,
        })
    }
})