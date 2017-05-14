let col1H = 0;
let col2H = 0;

Page({

    data: {
        // scrollH: 0,
        imgWidth: 0,
        loadingCount: 0,
        images: [],
        col1: [],
        col2: [],
        page: 1,

        imgUrl: [],
    },

    onLoad: function () {
        let that = this;

        wx.getSystemInfo({
            success: (res) => {
                let ww = res.windowWidth;
                let wh = res.windowHeight;
                let imgWidth = ww * 0.48;
                // let scrollH = wh;

                that.setData({
                    // scrollH: scrollH,
                    imgWidth: imgWidth
                });

                // that.loadImages();
                that.load_pictures();
            }
        })
    },
    onPullDownRefresh: function () {
        let that = this;

        that.setData({
            showTopTips1: false,
        });

        that.load_pictures('pulldown');

        setTimeout(function () {
            that.setData({
                showTopTips2: true
            });
        }, 1000);

        setTimeout(function () {
            that.setData({
                showTopTips2: false
            });
        }, 2500);
    },
    load_pictures: function (pulldown) {
        let that = this;

        wx.request({
            url: 'https://collhome.com/shangongyuan/api/pictures',
            success: function (res) {
                console.log(res.data)
                that.setData({
                    images: res.data.data
                })

                if (pulldown) {
                    wx.stopPullDownRefresh();
                    console.log('pulllllll');
                }
            }
        })
    },
    onImageLoad: function (e) {
        console.log('e', e);
        let imageId = e.currentTarget.id;
        let oImgW = e.detail.width;         //图片原始宽度
        let oImgH = e.detail.height;        //图片原始高度
        let imgWidth = this.data.imgWidth;  //图片设置的宽度
        let scale = imgWidth / oImgW;        //比例计算
        let imgHeight = oImgH * scale;      //自适应高度

        let images = this.data.images;
        let imageObj = null;

        console.log('imgHeight', imgHeight);
        console.log('images', images);
        console.log('imageId', imageId);

        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            if (img.id == imageId) {
                imageObj = img;
                break;
            }
        }

        console.log('imageObj', imageObj);

        if (imageObj)
            imageObj.height = imgHeight;

        console.log('imageObj1', imageObj);

        let loadingCount = this.data.loadingCount - 1;
        let col1 = this.data.col1;
        let col2 = this.data.col2;

        if (col1H <= col2H) {
            col1H += imgHeight;
            col1.push(imageObj);
        } else {
            col2H += imgHeight;
            col2.push(imageObj);
        }

        console.log('col1', col1);
        console.log('col2', col2);

        let data = {
            loadingCount: loadingCount,
            col1: col1,
            col2: col2
        };

        if (!loadingCount) {
            data.images = [];
        }

        console.log('data col1 col2', data);
        this.setData(data);
    },

    loadImages: function () {
        var that = this
        wx.showToast({
            title: '拼命加载中...',
            icon: 'loading',
            duration: 2000
        })
        wx.request({
            url: 'https://api.getweapp.com/vendor/tngou/tnfs/api/list?page=' + this.data.page,
            success: function (res) {
                console.log('res', res);
                wx.hideToast()
                that.setData({
                    loadingCount: res.data.tngou.length,
                    images: res.data.tngou,
                    page: that.data.page + 1
                })
            }
        })

    },



    //显示隐藏商品详情弹窗
    showGoodsDetail: function (e) {
        console.log('e', e);
        console.log('e.target.dataset.imgurl', e.target.dataset.imgurl);
        console.log('e.target.dataset.userid', e.target.dataset.userid);

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
            url: 'https://collhome.com/shangongyuan/api/users/' + user_id,
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