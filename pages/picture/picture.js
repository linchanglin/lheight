var app = getApp()
Page({

    data: {
        page: 1,
        imgUrl: [],
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
    onPullDownRefresh: function () {
        let that = this;
        that.load_pictures('pulldown');
    },
    load_pictures: function (parameter) {
        let that = this;

        wx.request({
            url: 'https://collhome.com/apis/pictures',
            success: function (res) {
                console.log('pictures', res.data.data);

                let pictures = res.data.data;
                that.setData({
                    pictures: pictures
                })

                if (parameter) {
                    wx.stopPullDownRefresh();
                    wx.hideLoading()
                }

                if (!pictures || pictures.length == 0) {
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
        })
    },




    //显示隐藏商品详情弹窗
    showGoodsDetail: function (e) {
        this.load_user(e.target.dataset.userid);
        this.setData({
            showGoodsDetail: !this.data.showGoodsDetail,
            id: e.target.dataset.id,

            imgUrl: e.target.dataset.imgurl,
            showName: 'zoomIn'
        });
    },
    load_user: function (user_id) {
        let that = this;

        wx.request({
            url: 'https://collhome.com/apis/users/' + user_id,
            success: function (res) {
                console.log('user', res.data)
                that.setData({
                    userInfo: res.data.data,
                })
            }
        })
    },
    hideGoodsDetail: function () {
        // showGoodsDetail: false,
        let that = this;
        that.setData({
            showName: 'zoomOut',
            // showGoodsDetail: false,
        })

        setTimeout(function () {
            that.setData({
                showGoodsDetail: false,
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
    }
})