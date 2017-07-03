import common from '../../utils/common.js';
var app = getApp()

Page({
    data: {
        // 测试用
        test_loves: [
            {id: 1, content: '我喜欢余生这个词多么好听，想表达什么呢，岁月如风，刮来阵阵暖意，又刮走了人们的念想，岁月如酒，香椿而又清香，醉时的的你又那么深意。它时刻都在，他在和你挥手，但你又抓不住它，是啊，如此反复出现在你的面', images:['http://cdn.collhome.com/tmp_1368536078o6zAJs2-BFKQ2p3cSIBWonXCBvL8213c513a61561aaf21a1a5b49eda3b2b.jpeg'] },
            {id: 2, content: '清珞，你在想我吗？那本日记是否还有新的字迹，我们的爱，还未结束！'},
            {id: 3, content: '美静静地舒展着韵划过心间，一关千年的情冲破神的禁忌，若同宣泄的雪花，漫着天空，裹着大地，抚着心灵。寻找在极限的边缘，在阳光的沉睡中醒来，一帘梦的幽思，随着若隐若现的星越来越繁。'},

        ],






        page: 1,
        reach_bottom: false,
        page_no_data: false,


        showTopTips1: false,
        showTopTips2: false,
        // showTopTips2: true,
        animationData: {},


        inputShowed: false,
        inputVal: "",
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

        that.load_loves('onLoad');
    },
    onShow: function () {
        let that = this;

        that.get_available();

        let board_loves_need_refresh = wx.getStorageSync('board_loves_need_refresh')
        if (board_loves_need_refresh) {
            that.load_refresh_loves(board_loves_need_refresh);
            wx.removeStorageSync('board_loves_need_refresh')
        }
        let board_loves_need_refresh_delete_love = wx.getStorageSync('board_loves_need_refresh_delete_love')
        if (board_loves_need_refresh_delete_love) {
            that.load_refresh_loves_delete_love(board_loves_need_refresh_delete_love);
            wx.removeStorageSync('board_loves_need_refresh_delete_love')
        }
        let board_loves_need_refresh_create_love = wx.getStorageSync('board_loves_need_refresh_create_love')
        if (board_loves_need_refresh_create_love) {
            that.load_loves('pulldown');
            wx.removeStorageSync('board_loves_need_refresh_create_love')
        }

        if (that.data.loves && !board_loves_need_refresh_create_love) {
            that.get_unreadLoveNums();
        }
    },
    get_available: function () {
        let that = this;
        wx.request({
            url: 'https://collhome.com/shanghai/apis/get_available',
            success: function (res) {
                let get_available = res.data.data;
                that.setData({
                    get_available: get_available
                })
                console.log('that.data.get_available', that.data.get_available);
            }
        })
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
                let old_loves = that.data.loves;
                for (let old_love of old_loves) {
                    if (old_love.id == need_refresh_love_id) {
                        // old_love = the_refresh_love
                        old_love.praise_nums = the_refresh_love.praise_nums;
                        old_love.comment_nums = the_refresh_love.comment_nums;
                        old_love.if_my_comment = the_refresh_love.if_my_comment;
                        old_love.if_my_praise = the_refresh_love.if_my_praise;
                    }
                }
                console.log('load_refresh_loves old_loves', old_loves);
                that.setData({
                    loves: old_loves
                })
            }
        })
    },
    load_refresh_loves_delete_love: function (love_id) {
        let that = this;
        let old_loves = that.data.loves;
        let new_loves = [];
        for (let old_love of old_loves) {
            if (old_love.id != love_id) {
                new_loves.push(old_love)
            }
        }
        console.log('load_refresh_loves_delete_love new_loves', new_loves);
        that.setData({
            loves: new_loves
        })
    },
    get_unreadLoveNums: function () {
        let that = this;
        let url;
        let love_id = that.data.loves[0].id;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            url = `https://collhome.com/shanghai/apis/unreadLoveNums?love_id=${love_id}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/shanghai/apis/unreadLoveNums?love_id=${love_id}&wesecret=`
        }
        wx.request({
            url: url,
            success: function (res) {
                console.log('get_unreadLoveNums res', res);
                let unreadLoveNums = res.data.unreadLoveNums;
                if (unreadLoveNums > 0) {
                    that.setData({
                        showTopTips1: true,
                        unreadLoveNums: res.data.unreadLoveNums
                    })
                }
            }
        })
    },
    onPullDownRefresh: function () {
        let that = this;
        that.setData({
            showTopTips1: false,
        });

        that.load_loves('pulldown');
    },
    onReachBottom: function () {
        let that = this;
        console.log('onReachBottom')
        if (!that.data.page_no_data) {
            that.setData({
                reach_bottom: true,
                page_no_data: false,
                page: that.data.page + 1
            })
            that.load_loves('add_page')
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
    load_loves: function (parameter) {
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
        let type = 'newLoves';
        let url;
        if (wesecret) {
            url = `https://collhome.com/shanghai/apis/loves?type=${type}&page=${page}&search=${search}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/shanghai/apis/loves?type=${type}&page=${page}&search=${search}&wesecret=`
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
                            reach_bottom: false,
                            page_no_data: true
                        })
                    } else {
                        let new_loves = that.data.loves.concat(loves);
                        that.setData({
                            loves: new_loves
                        })
                        that.setData({
                            reach_bottom: false,
                            page_no_data: false

                        })
                    }
                } else {
                    that.setData({
                        loves: loves
                    })
                }
                if (parameter == 'pulldown' || parameter == 'onLoad') {
                    wx.stopPullDownRefresh();
                    wx.hideLoading()
                }

                if (parameter == 'pulldown') {
                    if (that.data.unreadLoveNums > 0) {
                        that.setData({
                            showTopTips2: true
                        });
                        setTimeout(function () {
                            let animation = wx.createAnimation({
                                duration: 500,
                            })
                            animation.translateY(-100).step()
                            that.setData({
                                animationData: animation.export()
                            })
                        }, 1500)
                        setTimeout(function () {
                            that.setData({
                                showTopTips2: false,
                                animationData: {}
                            });
                        }, 2000);
                    }
                }

                if (!that.data.loves || that.data.loves.length == 0) {
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
                let old_loves = that.data.loves;
                for (let value of old_loves) {
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
                    loves: old_loves,
                    selected_love_id: love_id
                })
            });
        } else {
            common.signIn().then(() => {
                common.praiseLove(e).then((love_id) => {
                    let old_loves = that.data.loves;
                    for (let value of old_loves) {
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
                        loves: old_loves,
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
        that.load_loves('pulldown');
    }

});
