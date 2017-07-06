// 从myCommentLove.js 复制过来  只是去掉了 image 和 activeIndex 和 改了 let type = 'myLoves'; 还有 mycomment 改为 my;

import common from '../../utils/common.js';
var app = getApp()

Page({
    data: {
        hot_page: 1,
        hot_reach_bottom: false,
        hot_page_no_data: false,


        hot_inputShowed: false,
        hot_inputVal: "",
    },
    onLoad: function () {
        let that = this;

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
    },
    onShow: function () {
        let that = this;

        let my_loves_need_refresh = wx.getStorageSync('my_loves_need_refresh')
        if (my_loves_need_refresh) {
            that.load_refresh_loves(my_loves_need_refresh);
            wx.removeStorageSync('my_loves_need_refresh')
        }
        let my_loves_need_refresh_delete_love = wx.getStorageSync('my_loves_need_refresh_delete_love')
        if (my_loves_need_refresh_delete_love) {
            that.load_refresh_loves_delete_love(my_loves_need_refresh_delete_love);
            wx.removeStorageSync('my_loves_need_refresh_delete_love')
        }
    },
    load_refresh_loves: function (need_refresh_love_id) {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let url;
        if (wesecret) {
            url = `https://collhome.com/shanghai/apis/loves/${need_refresh_love_id}?wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/shanghai/apis/loves/${need_refresh_love_id}?wesecret=`
        }
        wx.request({
            url: url,
            success: function (res) {
                console.log("load_refresh_loves res", res.data.data)
                let the_refresh_love = res.data.data;

                let old_hot_loves = that.data.hot_loves;

                for (let old_love of old_hot_loves) {
                    if (old_love.id == need_refresh_love_id) {
                        // old_love = the_refresh_love
                        old_love.praise_nums = the_refresh_love.praise_nums;
                        old_love.comment_nums = the_refresh_love.comment_nums;
                        old_love.if_my_comment = the_refresh_love.if_my_comment;
                        old_love.if_my_praise = the_refresh_love.if_my_praise;
                    }
                }

                that.setData({
                    hot_loves: old_hot_loves,
                })
            }
        })
    },
    load_refresh_loves_delete_love: function (love_id) {
        let that = this;
        let old_hot_loves = that.data.hot_loves;
        let new_hot_loves = [];
        for (let old_hot_love of old_hot_loves) {
            if (old_hot_love.id != love_id) {
                new_hot_loves.push(old_hot_love)
            }
        }

        console.log('load_refresh_loves_delete_love', love_id);
        that.setData({
            hot_loves: new_hot_loves,
        })
    },
    onPullDownRefresh: function () {
        let that = this;

        that.load_hotLoves('pulldown');
    },
    onReachBottom: function () {
        let that = this;

        if (!that.data.hot_page_no_data) {
            that.setData({
                hot_reach_bottom: true,
                hot_page_no_data: false,
                hot_page: that.data.hot_page + 1
            })
            that.load_hotLoves('add_page')
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
        let type = 'myLoves';
        let url;
        if (wesecret) {
            url = `https://collhome.com/shanghai/apis/loves?type=${type}&page=${hot_page}&search=${search}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/shanghai/apis/loves?type=${type}&page=${hot_page}&search=${search}&wesecret=`
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

                let status = res.data.status;
                console.log('status', status);
                if (status == 200) {
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
            }
        })

    },
    previewImage: function (e) {
        console.log('preview e', e);
        var current = e.currentTarget.dataset.current;
        var urls = e.currentTarget.dataset.urls;

        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    showLoveActionSheet: function (e) {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            common.showLoveActionSheet(e).then((love_id) => {
                console.log('delete love_id', love_id)
                that.load_refresh_loves_delete_love(love_id);
            });
        } else {
            common.signIn().then(() => {
                common.showLoveActionSheet(e).then((love_id) => {
                    console.log('delete love_id', love_id)
                    that.load_refresh_loves_delete_love(love_id);
                });
            });
        }
    },
    praiseLove: function (e) {
        let love_if_my_praise = e.currentTarget.dataset.loveifmypraise;
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            common.praiseLove(e).then((love_id) => {

                let old_hot_loves = that.data.hot_loves;
                for (let value of old_hot_loves) {
                    if (value.id == love_id) {
                        value.praise_nums = parseInt(value.praise_nums);
                        if (love_if_my_praise == 0) {
                            value.if_my_praise = 1;
                            value.praise_nums++
                        } else {
                            value.if_my_praise = 0
                            value.praise_nums--
                        }
                    }
                }

                that.setData({
                    hot_loves: old_hot_loves,

                    selected_love_id: love_id
                })

            });
        } else {
            common.signIn().then(() => {
                common.praiseLove(e).then((love_id) => {

                    let old_hot_loves = that.data.hot_loves;
                    for (let value of old_hot_loves) {
                        if (value.id == love_id) {
                            value.praise_nums = parseInt(value.praise_nums);
                            if (love_if_my_praise == 0) {
                                value.if_my_praise = 1;
                                value.praise_nums++
                            } else {
                                value.if_my_praise = 0
                                value.praise_nums--
                            }
                        }
                    }

                    that.setData({
                        hot_loves: old_hot_loves,

                        selected_love_id: love_id
                    })

                });
            });
        }
    },
    longtap_love: function (e) {
        console.log('longtap_love', e);
        let love_id = e.currentTarget.dataset.loveid;
        var that = this;
        that.setData({
            item_selected_love_id: love_id
        })
    },
    touchmove_love: function (e) {
        let that = this;
        that.setData({
            item_selected_love_id: ''
        })
    },
    navigateToLove: function (e) {
        console.log('navigateToLove', e);
        let love_id = e.currentTarget.dataset.loveid;
        let that = this;
        that.setData({
            item_selected_love_id: love_id
        })
        setTimeout(function () {
            that.setData({
                item_selected_love_id: ''
            })
        }, 450)
        wx.navigateTo({
            url: '../comment/comment?love_id=' + love_id
        });
    },
    navigateToComment: function (e) {
        console.log('navigateToComment', e);
        let love_id = e.currentTarget.dataset.loveid;
        let comment_nums = e.currentTarget.dataset.commentnums;

        var that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (comment_nums == 0) {
            if (wesecret) {
                wx.navigateTo({
                    url: '../commentInput/commentInput?love_id=' + love_id
                });
            } else {
                common.signIn().then(() => {
                    wx.navigateTo({
                        url: '../commentInput/commentInput?love_id=' + love_id
                    });
                });
            }
        } else {
            wx.navigateTo({
                url: `../comment/comment?love_id=${love_id}`
            });
        }
    },
    navigateToProfileShow: function (e) {
        console.log('navigateToProfileShow', e);
        let that = this;
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: '../profileShow/profileShow?user_id=' + user_id
        })
    },
    navigateToLocation: function (e) {
        console.log('location', e);
        let location = e.currentTarget.dataset.location;
        wx.openLocation({
            name: location.name,
            address: location.address,
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            // scale: 18,
            success: function (res) {
                console.log('openLocation success', res);
            },
            fail: function (res) {
                console.log('openLocation fail', res);
            }
        })
    },












    showInput: function () {
        let that = this;

        that.setData({
            hot_inputShowed: true
        });
    },
    hideInput: function () {
        let that = this;

        that.setData({
            hot_inputVal: "",
            hot_inputShowed: false
        });
    },
    clearInput: function () {
        let that = this;

        that.setData({
            hot_inputVal: ""
        });
    },
    inputTyping: function (e) {
        let that = this;

        that.setData({
            hot_inputVal: e.detail.value
        });
    },
    searchInputConfirm: function (e) {
        let that = this;

        that.load_hotLoves('pulldown');
    }
});