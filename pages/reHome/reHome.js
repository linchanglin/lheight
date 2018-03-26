Page({
  data: {},
  onLoad: function () {
    let that = this;
    that.load_aboutLoveWalls();
  },
  onShareAppMessage: function () {
    return {
      title: `校园生活墙`,
      path: `/pages/reHome/reHome`,
      success: function (res) {
        console.log("onShareAppMessage", res);
      }
    }
  },
  load_aboutLoveWalls: function () {
    let that = this;
    wx.request({
      url: 'https://collhome.com/life/apis/reHomes',
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