import common from '../../utils/common.js';

Page({
    data: {
        page: 1,
        reach_bottom: false,
        page_no_data: false,


        showTopTips1: false,
        showTopTips2: false,


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

        that.load_loves('onLoad');

        wx.getSystemInfo({
            success: (res) => {
                let ww = res.windowWidth - 20;
                let image_width = (ww - 2) / 3;
                that.setData({
                    ww: ww,
                    image_width: image_width
                })
            }
        })
    },
    onShow: function () {
        let that = this;

        if (!that.data.wesecret) {
            let wesecret = wx.getStorageSync('wesecret');
            if (wesecret) {
                that.setData({
                    wesecret: wesecret
                })
                that.load_loves();
            }
        }

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
            that.onPullDownRefresh();
            wx.removeStorageSync('board_loves_need_refresh_create_love')
        }

        if (that.data.loves) {
            that.get_unreadLoveNums();
        }
    },
    load_refresh_loves: function (need_refresh_love_id) {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let url;
        if (wesecret) {
            url = `https://collhome.com/apis/loves/${need_refresh_love_id}?wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/apis/loves/${need_refresh_love_id}`
        }
        wx.request({
            url: url,
            success: function (res) {
                console.log("load_refresh_loves res", res.data.data)
                let the_refresh_love = res.data.data;
                let old_loves = that.data.loves;
                for (let old_love of old_loves) {
                    if (old_love.id == need_refresh_love_id) {
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
            url = `https://collhome.com/apis/unreadLoveNums?love_id=${love_id}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/apis/unreadLoveNums?love_id=${love_id}&wesecret=`
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
        console.log('onPullDownRefresh')

        let that = this;
        that.setData({
            page: 1,
            reach_bottom: false,
            page_no_data: false,
        })
        that.setData({
            showTopTips1: false,
        });

        that.load_loves('pulldown');

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
    onShareAppMessage: function () {
        return {
            title: '表白墙',
            path: '/pages/board/board'
        }
    },
    load_loves: function (parameter) {
        let that = this;
        let page = that.data.page;
        let search = that.data.inputVal;
        let wesecret = wx.getStorageSync('wesecret');
        let url;
        if (wesecret) {
            url = `https://collhome.com/apis/loves?page=${page}&search=${search}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/apis/loves?page=${page}&search=${search}&wesecret=`
        }
        wx.request({
            url: url,
            success: function (res) {
                console.log('loves', res.data);
                let loves = res.data.data;
                if (parameter && parameter == 'add_page') {
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
                            reach_bottom: false
                        })
                    }
                } else {
                    that.setData({
                        loves: loves
                    })
                }
                if (parameter) {
                    if (parameter == 'pulldown' || parameter == 'onLoad') {
                        wx.stopPullDownRefresh();
                        wx.hideLoading()
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
        let my_userInfo = wx.getStorageSync('my_userInfo');
        if (wesecret) {
            if (my_userInfo) {
                common.showLoveActionSheet(e).then((love_id) => {
                    console.log('delete love_id', love_id)
                    that.load_refresh_loves_delete_love(love_id);
                });
            } else {
                common.get_my_userInfo(wesecret);
            }
        } else {
            common.signIn();
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
            common.signIn();
        }
    },
    shareLove: function (e) {
        let love_id = e.currentTarget.dataset.loveid;

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
                common.signIn();
            }
        } else {
            wx.navigateTo({
                url: `../comment/comment?love_id=${love_id}&scroll=scroll_to_comments`
            });
        }
    },
    navigateToProfileShow: function (e) {
        console.log('navigateToProfileShow', e);

        let that = this;
        that.setData({
            hoverClass: ''
        })

        let user_id = e.currentTarget.dataset.userid;

        wx.navigateTo({
            url: '../profileShow/profileShow?user_id=' + user_id
        })
    },
    navigateToLocation: function (e) {
        console.log('location', e);
        let location = e.currentTarget.dataset.location;

        console.log('location111', location);

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
        that.setData({
            page: 1
        })
        that.load_loves();
    }

});
