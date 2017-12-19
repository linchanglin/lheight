Page({
  data: {
    // 测试用
    test_loves: [
      { id: 1, content: '这里是校园生活墙，这里是校园生活墙这里是校园生活墙，这里是校园生活墙，这里是校园生活墙，这里是校园生活墙这里是校园生活墙，这里是校园生活墙。' },
    ],






    radios: [],
    page: 1,
    reach_bottom: false,
    page_no_data: false,
  },
  onLoad: function () {
    let that = this;
    that.load_radios();
  },
  onShow: function () {
    let that = this;
    that.get_available();
  },
  get_available: function () {
    let that = this;
    wx.request({
      url: 'https://collhome.com/life/apis/get_availables',
      success: function (res) {
        let get_available = res.data.data;
        that.setData({
          get_available: get_available
        })
      }
    })
  },
  onReachBottom: function () {
    let that = this;
    if (!that.data.page_no_data) {
      that.setData({
        reach_bottom: true,
        page_no_data: false,
        page: that.data.page + 1
      })
      that.load_radios()
    }
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: `分享电台`,
      path: `/pages/square/square`
    }
  },
  load_radios: function () {
    let that = this;
    let page = that.data.page;
    console.log('page', page);
    wx.request({
      url: `https://collhome.com/life/apis/radios?page=${page}`,
      success: function (res) {
        console.log('load_radios res', res);
        if (page == 1) {
          that.setData({
            square_imgs: res.data.square_imgs,
            square_title: res.data.square_title
          })
        }

        let radios = res.data.data;
        if (radios.length == 0) {
          that.setData({
            reach_bottom: false,
            page_no_data: true
          })
        } else {
          let new_radios = that.data.radios.concat(radios);
          that.setData({
            radios: new_radios
          })
        }
      }
    })
  },
  navigateToArticle: function (e) {
    console.log('navigateToArticle', e);
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.navigateTo({
      url: `../article/article?id=${id}`,
    })
  }
})