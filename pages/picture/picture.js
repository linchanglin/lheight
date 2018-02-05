import common from '../../utils/common.js';
var app = getApp()
Page({

    data: {
      // 测试用
      test_loves: [
        { id: 1, content: '北京大学，简称“北大”，诞生于1898年，初名京师大学堂，是中国近代第一所国立大学，也是最早以“大学”之名创办的学校，其成立标志着中国近代高等教育的开端。北大是中国近代以来唯一以国家最高学府身份创立的学校，最初也是国家最高教育行政机关，行使教育部职能，统管全国教育。北大催生了中国最早的现代学制，开创了中国最早的文科、理科、社科、农科、医科等大学学科，是近代以来中国高等教育的奠基者。' },
      ],





        imgUrl: [],

        page: 1,
        reach_bottom: false,
        page_no_data: false,

        inputShowed: false,
        inputVal: "",
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

        let ww = app.data.deviceInfo.windowWidth;
        let image_width = (ww - 2) / 3;
        that.setData({
            ww: ww,
            image_width: image_width
        })

        that.load_pictures('onLoad');
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
    onShareAppMessage: function () {
        return {
            title: `分享眼缘墙`,
            path: `/pages/picture/picture`,
            success: function (res) {
                console.log("onShareAppMessage", res);
            }
        }
    },
    onPullDownRefresh: function () {
        let that = this;
        that.load_pictures('pulldown');
    },
    onReachBottom: function () {
        let that = this;
        if (!that.data.page_no_data) {
            that.setData({
                reach_bottom: true,
                page_no_data: false,
                page: that.data.page + 1
            })
            that.load_pictures('add_page')
        }
    },
    load_pictures: function (parameter) {
        let that = this;

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
        let search = that.data.inputVal;
        let wesecret = wx.getStorageSync('wesecret');
        let url;
        if (wesecret) {
            url = `https://collhome.com/life/apis/pictures?page=${page}&search=${search}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/life/apis/pictures?page=${page}&search=${search}&wesecret=`
        }
        wx.request({
            url: url,
            success: function (res) {
                console.log('pictures', res.data.data);
                let pictures = res.data.data;

                if (parameter == 'add_page') {
                    console.log("pictures.length", pictures.length)
                    if (pictures.length == 0) {
                        that.setData({
                            reach_bottom: false,
                            page_no_data: true
                        })
                    } else {
                        let new_pictures = that.data.pictures.concat(pictures);
                        that.setData({
                            pictures: new_pictures
                        })
                        that.setData({
                            reach_bottom: false,
                            page_no_data: false
                        })
                    }
                } else {
                    that.setData({
                        pictures: pictures
                    })
                }
                if (parameter == 'pulldown' || parameter == 'onLoad') {
                    wx.stopPullDownRefresh();
                    wx.hideLoading()
                }

                let status = res.data.status;
                console.log('status', status);
                if (status == 200) {
                    if (!that.data.pictures || that.data.pictures.length == 0) {
                        wx.showModal({
                            // title: '提示',
                            showCancel: false,
                            content: '没有照片',
                            success: function (res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }
                }
            }
        })
    },

    openPictures: function (e) {
        let userInfo = e.target.dataset.userinfo;
        let imgUrl = e.target.dataset.imgurl;

        console.log('userInfo', userInfo);
        
        this.setData({
            showPictures: true,
            userInfo: userInfo,
            imgUrl: imgUrl,
            showName: 'zoomIn'
        });
    },
    closePictures: function () {
        let that = this;
        that.setData({
            showName: 'zoomOut',
        })

        setTimeout(function () {
            that.setData({
                showPictures: false,
                imgUrl: []
            })
        }, 300)
    },
    navigateToProfileShow: function (e) {
        console.log('eee', e);
        let user_id = e.target.dataset.userid;
        wx.navigateTo({
            url: '../profileShow/profileShow?user_id=' + user_id,
        })
    },








    showInput: function () {
        let that = this;
        that.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        let that = this;
        that.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        let that = this;
        that.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        let that = this;
        that.setData({
            inputVal: e.detail.value
        });
    },
    searchInputConfirm: function (e) {
        let that = this;
        that.load_pictures('pulldown');
    }
})