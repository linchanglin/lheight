var app = getApp()
Page({

    data: {
        // 测试用
        test_loves: [
            { id: 1, content: '福州大学，简称福大，是国家“211工程”重点建设高校，教育部与福建省人民政府共建高校[1]  ，教育部首批“卓越工程师教育培养计划”试点高校之一[2]  ，福建省三所重点建设的高水平大学之一，入选“千人计划”[3]  、“国家建设高水平大学公派研究生项目”。' },
        ],





        imgUrl: [],

        page: 1,
        reach_bottom: false,
        page_no_data: false,

        inputShowed: false,
        inputVal: "",
    },

    onLoad: function () {
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
    },
    get_available: function () {
        let that = this;
        wx.request({
            url: 'https://collhome.com/apis/get_available',
            success: function (res) {
                let get_available = res.data.data;
                that.setData({
                    get_available: get_available
                })
            }
        })
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
            url = `https://collhome.com/apis/pictures?page=${page}&search=${search}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/apis/pictures?page=${page}&search=${search}&wesecret=`
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