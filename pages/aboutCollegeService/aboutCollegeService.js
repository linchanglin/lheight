Page({
    data: {},
    onLoad: function (options) {
        let that = this;

        let service_id = options.service_id;
        let service_name = options.service_name;

        wx.setNavigationBarTitle({
            title: `${service_name}`
        })

        that.load_aboutLoveWalls(service_id);
    },
    load_aboutLoveWalls: function (service_id) {
        let that = this;
        wx.request({
            url: `https://collhome.com/life/apis/aboutCollegeServices?service_id=${service_id}`,
            success: function (res) {
                console.log("load_aboutLoveWalls res", res);
                let aboutLoveWalls = res.data.data;

                that.setData({
                    aboutLoveWalls: aboutLoveWalls
                })
            }
        })
    },
    previewImage: function (e) {
        console.log('preview e', e);
        let current = e.currentTarget.dataset.current;
        let urls = [];
        urls.push(current);

        wx.previewImage({
            current: current,
            urls: urls
        })
    }
})