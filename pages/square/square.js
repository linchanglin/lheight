import common from '../../utils/common.js';

Page({
  data: {
    // 测试用
    test_loves: [
      { id: 1, content: '北京大学，简称“北大”，诞生于1898年，初名京师大学堂，是中国近代第一所国立大学，也是最早以“大学”之名创办的学校，其成立标志着中国近代高等教育的开端。北大是中国近代以来唯一以国家最高学府身份创立的学校，最初也是国家最高教育行政机关，行使教育部职能，统管全国教育。北大催生了中国最早的现代学制，开创了中国最早的文科、理科、社科、农科、医科等大学学科，是近代以来中国高等教育的奠基者。' },
    ],






    radios: [],
    page: 1,
    reach_bottom: false,
    page_no_data: false,
  },
  onLoad: function (options) {
    console.log('options', options);
    let init_college_id = options.college_id;
    if (init_college_id) {
      wx.setStorage({
        key: "init_college_id",
        data: init_college_id
      })
    }
    
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.load_radios('onLoad');
  },
  onShow: function () {
    let that = this;
    that.get_available();
    that.get_unreadNums();
  },
  get_available: function () {
    let that = this;
    common.get_available().then((get_available) => {
      console.log('common get_available', get_available);
      that.setData({
        get_available: get_available
      })
    });
  },
  get_unreadNums: function () {
    let that = this;
    common.get_unreadNums().then((unreadNums) => { })
  },
  onPullDownRefresh: function () {
    let that = this;
    that.load_radios('pulldown');
  },
  onReachBottom: function () {
    let that = this;
    if (!that.data.page_no_data) {
      that.setData({
        reach_bottom: true,
        page_no_data: false,
        page: that.data.page + 1
      })
      that.load_radios('add_page')
    }
  },
  onShareAppMessage: function () {
    let that = this;
    return {
      title: `分享电台`,
      path: `/pages/square/square`
    }
  },
  load_radios: function (parameter) {
    let that = this;
    // let page = that.data.page;

    let page;
    if (parameter == 'add_page') {
      page = that.data.page;
    } else {
      page = 1;
      that.setData({
        page: 1,
        reach_bottom: false,
        page_no_data: false
      })
    }

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
        if (parameter == 'add_page') {
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
        } else {
          that.setData({
            radios: radios
          })
        }

        if (parameter == 'pulldown' || parameter == 'onLoad') {
          wx.stopPullDownRefresh();
          wx.hideLoading()
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