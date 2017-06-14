import common from '../../utils/common.js';
var app = getApp()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: {
        tabs: ["热门", "图片", "视频"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,


        hot_page: 1,
        hot_reach_bottom: false,
        hot_page_no_data: false,
        image_page: 1,
        image_reach_bottom: false,
        image_page_no_data: false,
        video_page: 1,
        video_reach_bottom: false,
        video_page_no_data: false,

        hot_inputShowed: false,
        hot_inputVal: "",
        image_inputShowed: false,
        image_inputVal: "",
        video_inputShowed: false,
        video_inputVal: "",
    },
    tabClick: function (e) {
        let that = this;

        that.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    onLoad: function () {
        let that = this;

        wx.getSystemInfo({
            success: function (res) {
                console.log('systemInfo', res);
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                    mapHeight: res.windowHeight - 51
                });
            }
        });


        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            that.setData({
                wesecret: wesecret
            })
        }
        wx.showLoading({
            title: '加载中',
        })
        let ww = app.data.deviceInfo.windowWidth - 20;
        let image_width = (ww - 2) / 3;
        that.setData({
            ww: ww,
            image_width: image_width
        })
        that.load_hotLoves('onLoad');
        that.load_imageLoves('onLoad');
        that.load_videoLoves('onLoad');
    },
    onPullDownRefresh: function () {
        let that = this;
        let activeIndex = that.data.activeIndex;
        if (activeIndex == 0) {
            that.load_hotLoves('pulldown');
        } else if (activeIndex == 1) {
            that.load_imageLoves('pulldown');
        } else {
            that.load_videoLoves('pulldown');
        }
    },
    onReachBottom: function () {
        let that = this;
        let activeIndex = that.data.activeIndex;
        console.log('onReachBottom activeIndex', activeIndex);
        if (activeIndex == 0) {
            if (!that.data.hot_page_no_data) {
                that.setData({
                    hot_reach_bottom: true,
                    hot_page_no_data: false,
                    hot_page: that.data.hot_page + 1
                })
                that.load_hotLoves('add_page')
            }
        } else if (activeIndex == 1) {
            if (!that.data.image_page_no_data) {
                that.setData({
                    image_reach_bottom: true,
                    image_page_no_data: false,
                    image_page: that.data.image_page + 1
                })
                that.load_imageLoves('add_page')
            }
        } else {
            if (!that.data.video_page_no_data) {
                that.setData({
                    video_reach_bottom: true,
                    video_page_no_data: false,
                    video_page: that.data.video_page + 1
                })
                that.load_videoLoves('add_page')
            }
        }

    },
    share_touchstart: function (e) {
        let share_loveId = e.currentTarget.dataset.loveid;
        let share_userNickname = e.currentTarget.dataset.usernickname;
        let that = this;
        that.setData({
            share_loveId: share_loveId,
            share_userNickname: share_userNickname
        })
    },
    onShareAppMessage: function () {
        let that = this;
        let share_loveId = that.data.share_loveId;
        let share_userNickname = that.data.share_userNickname;
        console.log('share_loveId', share_loveId);
        return {
            title: `分享${share_userNickname}的表白`,
            path: `/pages/comment/comment?love_id=${share_loveId}`,
            success: function (res) {
                console.log("onShareAppMessage", res);
            }
        }
    },
    load_hotLoves: function (parameter) {
        let that = this;
        let hot_page;
        if (parameter == 'add_page') {
            hot_page = that.data.hot_page;
        } else {
            hot_page = 1;
            that.setData({
                hot_page: 1,
                hot_reach_bottom: false,
                hot_page_no_data: false
            })
        }
        let search = that.data.hot_inputVal;
        let wesecret = wx.getStorageSync('wesecret');
        let type = 'hotLoves';
        let url;
        if (wesecret) {
            url = `https://collhome.com/apis/loves?type=${type}&page=${hot_page}&search=${search}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/apis/loves?type=${type}&page=${hot_page}&search=${search}&wesecret=`
        }
        wx.request({
            url: url,
            success: function (res) {
                console.log('loves', res.data);
                let loves = res.data.data;
                if (parameter == 'add_page') {
                    console.log("loves.length", loves.length)
                    if (loves.length == 0) {
                        that.setData({
                            hot_reach_bottom: false,
                            hot_page_no_data: true
                        })
                    } else {
                        let new_loves = that.data.hot_loves.concat(loves);
                        that.setData({
                            hot_loves: new_loves
                        })
                        that.setData({
                            hot_reach_bottom: false,
                            hot_page_no_data: false

                        })
                    }
                } else {
                    that.setData({
                        hot_loves: loves
                    })
                }
                if (parameter == 'pulldown' || parameter == 'onLoad') {
                    wx.stopPullDownRefresh();
                    wx.hideLoading()
                }

                if (!that.data.hot_loves || that.data.hot_loves.length == 0) {
                    wx.showModal({
                        // title: '提示',
                        showCancel: false,
                        content: '没有表白',
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












    showInput: function () {
        let that = this;
        let activeIndex = that.data.activeIndex;
        if (activeIndex == 0) {
            that.setData({
                hot_inputShowed: true
            });
        } else if (activeIndex == 1) {
            that.setData({
                image_inputShowed: true
            });
        } else {
            that.setData({
                video_inputShowed: true
            });
        }

    },
    hideInput: function () {
        let that = this;
        let activeIndex = that.data.activeIndex;
        if (activeIndex == 0) {
            that.setData({
                hot_inputVal: "",
                hot_inputShowed: false
            });
        } else if (activeIndex == 1) {
            that.setData({
                image_inputVal: "",
                image_inputShowed: false
            });
        } else {
            that.setData({
                video_inputVal: "",
                video_inputShowed: false
            });
        }
    },
    clearInput: function () {
        let that = this;
        let activeIndex = that.data.activeIndex;
        if (activeIndex == 0) {
            that.setData({
                hot_inputVal: ""
            });
        } else if (activeIndex == 1) {
            that.setData({
                image_inputVal: ""
            });
        } else {
            that.setData({
                video_inputVal: ""
            });
        }
    },
    inputTyping: function (e) {
        let that = this;
        let activeIndex = that.data.activeIndex;
        if (activeIndex == 0) {
            that.setData({
                hot_inputVal: e.detail.value
            });
        } else if (activeIndex == 1) {
            that.setData({
                image_inputVal: e.detail.value
            });
        } else {
            that.setData({
                video_inputVal: e.detail.value
            });
        }
    },
    searchInputConfirm: function (e) {
        let that = this;
        let activeIndex = that.data.activeIndex;
        if (activeIndex == 0) {
            that.load_hotLoves('pulldown');
        } else if (activeIndex == 1) {
            that.load_imageLoves('pulldown');
        } else {
            that.load_videoLoves('pulldown');
        }
    }
});