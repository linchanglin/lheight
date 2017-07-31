import common from '../../utils/common.js';
var app = getApp()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: {
        // 测试用
        test_loves: [
            { id: 1, content: '这里是校园生活墙，这里是校园生活墙这里是校园生活墙，这里是校园生活墙，这里是校园生活墙，这里是校园生活墙这里是校园生活墙，这里是校园生活墙。' },
        ],






        tabs: ["最新", "热门", "置顶"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,


        hot_loves: [],
        image_loves: [],
        video_loves: [],


        hot_page: 1,
        hot_reach_bottom: false,
        hot_page_no_data: false,
        image_page: 1,
        image_reach_bottom: false,
        image_page_no_data: false,
        video_page: 1,
        video_reach_bottom: false,
        video_page_no_data: false,


        showTopTips1: false,
        showTopTips2: false,
        animationData: {},


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
    onShow: function () {
        let that = this;

        that.get_available();

        let love_loves_need_refresh = wx.getStorageSync('love_loves_need_refresh')
        if (love_loves_need_refresh) {
            that.load_refresh_loves(love_loves_need_refresh);
            wx.removeStorageSync('love_loves_need_refresh')
        }
        let love_loves_need_refresh_delete_love = wx.getStorageSync('love_loves_need_refresh_delete_love')
        if (love_loves_need_refresh_delete_love) {
            that.load_refresh_loves_delete_love(love_loves_need_refresh_delete_love);
            wx.removeStorageSync('love_loves_need_refresh_delete_love')
        }

        let love_loves_need_refresh_create_love = wx.getStorageSync('love_loves_need_refresh_create_love')
        if (that.data.hot_loves.length > 0 && that.data.activeIndex == 0 && !love_loves_need_refresh_create_love) {
            that.get_unreadLoveNums();
        }
        if (love_loves_need_refresh_create_love) {
            that.setData({
                activeIndex: 0
            })
            that.load_hotLoves('pulldown');
            that.load_imageLoves('pulldown');
            that.load_videoLoves('pulldown');
            wx.removeStorageSync('love_loves_need_refresh_create_love')
        }     
    },
    get_available: function () {
        let that = this;
        wx.request({
            url: 'https://collhome.com/life/apis/get_available',
            success: function (res) {
                let get_available = res.data.data;
                that.setData({
                    get_available: get_available
                })
            }
        })
    },
    load_refresh_loves: function (need_refresh_love_id) {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let url;
        if (wesecret) {
            url = `https://collhome.com/life/apis/loves/${need_refresh_love_id}?wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/life/apis/loves/${need_refresh_love_id}?wesecret=`
        }
        wx.request({
            url: url,
            success: function (res) {
                console.log("load_refresh_loves res", res.data.data)
                let the_refresh_love = res.data.data;

                let old_hot_loves = that.data.hot_loves;
                let old_image_loves = that.data.image_loves;
                let old_video_loves = that.data.video_loves;

                for (let old_love of old_hot_loves) {
                    if (old_love.id == need_refresh_love_id) {
                        // old_love = the_refresh_love
                        old_love.praise_nums = the_refresh_love.praise_nums;
                        old_love.comment_nums = the_refresh_love.comment_nums;
                        old_love.if_my_comment = the_refresh_love.if_my_comment;
                        old_love.if_my_praise = the_refresh_love.if_my_praise;
                    }
                }
                for (let old_love of old_image_loves) {
                    if (old_love.id == need_refresh_love_id) {
                        // old_love = the_refresh_love
                        old_love.praise_nums = the_refresh_love.praise_nums;
                        old_love.comment_nums = the_refresh_love.comment_nums;
                        old_love.if_my_comment = the_refresh_love.if_my_comment;
                        old_love.if_my_praise = the_refresh_love.if_my_praise;
                    }
                }
                for (let old_love of old_video_loves) {
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
                    image_loves: old_image_loves,
                    video_loves: old_video_loves,
                })
            }
        })
    },
    load_refresh_loves_delete_love: function (love_id) {
        let that = this;
        let old_hot_loves = that.data.hot_loves;
        let old_image_loves = that.data.image_loves;
        let old_video_loves = that.data.video_loves;
        let new_hot_loves = [];
        let new_image_loves = [];
        let new_video_loves = [];
        for (let old_hot_love of old_hot_loves) {
            if (old_hot_love.id != love_id) {
                new_hot_loves.push(old_hot_love)
            }
        }
        for (let old_image_love of old_image_loves) {
            if (old_image_love.id != love_id) {
                new_image_loves.push(old_image_love)
            }
        }
        for (let old_video_love of old_video_loves) {
            if (old_video_love.id != love_id) {
                new_video_loves.push(old_video_love)
            }
        }
        console.log('load_refresh_loves_delete_love', love_id);
        that.setData({
            hot_loves: new_hot_loves,
            image_loves: new_image_loves,
            video_loves: new_video_loves,
        })
    },
    get_unreadLoveNums: function () {
        let that = this;
        let url;
        let love_id;
        if (that.data.hot_loves[0].id) {
            love_id = that.data.hot_loves[0].id;
        } else {
            love_id = 0;
        }
        let wesecret = wx.getStorageSync('wesecret');
        let postingType_id = 1;
        if (wesecret) {
            url = `https://collhome.com/life/apis/unreadLoveNums?postingType_id=${postingType_id}&love_id=${love_id}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/life/apis/unreadLoveNums?postingType_id=${postingType_id}&love_id=${love_id}&wesecret=`
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
        let activeIndex = that.data.activeIndex;
        if (activeIndex == 0) {
            that.setData({
                showTopTips1: false,
            });

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
        if (share_loveId) {
            return {
                title: `分享${share_userNickname}的帖子`,
                path: `/pages/comment/comment?love_id=${share_loveId}`,
                success: function (res) {
                    console.log("onShareAppMessage", res);
                }
            }
        } else {
            return {
                title: `分享校园生活墙`,
                path: `/pages/love/love`,
                success: function (res) {
                    console.log("onShareAppMessage", res);
                }
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
        let type = 'newLoves';
        let url;
        if (wesecret) {
            url = `https://collhome.com/life/apis/loves?type=${type}&page=${hot_page}&search=${search}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/life/apis/loves?type=${type}&page=${hot_page}&search=${search}&wesecret=`
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
                                animationData: {},

                                unreadLoveNums: 0
                            });
                        }, 2000);
                    }
                }
            }
        })

    },
    load_imageLoves: function (parameter) {
        let that = this;
        let image_page;
        if (parameter == 'add_page') {
            image_page = that.data.image_page;
        } else {
            image_page = 1;
            that.setData({
                image_page: 1,
                image_reach_bottom: false,
                image_page_no_data: false
            })
        }
        let search = that.data.image_inputVal;
        let wesecret = wx.getStorageSync('wesecret');
        let type = 'hotLoves';
        let url;
        if (wesecret) {
            url = `https://collhome.com/life/apis/loves?type=${type}&page=${image_page}&search=${search}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/life/apis/loves?type=${type}&page=${image_page}&search=${search}&wesecret=`
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
                            image_reach_bottom: false,
                            image_page_no_data: true
                        })
                    } else {
                        let new_loves = that.data.image_loves.concat(loves);
                        that.setData({
                            image_loves: new_loves
                        })
                        that.setData({
                            image_reach_bottom: false,
                            image_page_no_data: false

                        })
                    }
                } else {
                    that.setData({
                        image_loves: loves
                    })
                }
                if (parameter == 'pulldown' || parameter == 'onLoad') {
                    wx.stopPullDownRefresh();
                    wx.hideLoading()
                }
            }
        })

    },
    load_videoLoves: function (parameter) {
        let that = this;
        let video_page;
        if (parameter == 'add_page') {
            video_page = that.data.video_page;
        } else {
            video_page = 1;
            that.setData({
                video_page: 1,
                video_reach_bottom: false,
                video_page_no_data: false
            })
        }
        let search = that.data.video_inputVal;
        let wesecret = wx.getStorageSync('wesecret');
        let type = 'topLoves';
        let url;
        if (wesecret) {
            url = `https://collhome.com/life/apis/loves?type=${type}&page=${video_page}&search=${search}&wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/life/apis/loves?type=${type}&page=${video_page}&search=${search}&wesecret=`
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
                            video_reach_bottom: false,
                            video_page_no_data: true
                        })
                    } else {
                        let new_loves = that.data.video_loves.concat(loves);
                        that.setData({
                            video_loves: new_loves
                        })
                        that.setData({
                            video_reach_bottom: false,
                            video_page_no_data: false

                        })
                    }
                } else {
                    that.setData({
                        video_loves: loves
                    })
                }
                if (parameter == 'pulldown' || parameter == 'onLoad') {
                    wx.stopPullDownRefresh();
                    wx.hideLoading()
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
                let old_image_loves = that.data.image_loves;
                let old_video_loves = that.data.video_loves;
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
                for (let value of old_image_loves) {
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
                for (let value of old_video_loves) {
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
                    image_loves: old_image_loves,
                    video_loves: old_video_loves,

                    selected_love_id: love_id
                })

            });
        } else {
            common.signIn().then(() => {
                common.praiseLove(e).then((love_id) => {

                    let old_hot_loves = that.data.hot_loves;
                    let old_image_loves = that.data.image_loves;
                    let old_video_loves = that.data.video_loves;
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
                    for (let value of old_image_loves) {
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
                    for (let value of old_video_loves) {
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
                        image_loves: old_image_loves,
                        video_loves: old_video_loves,

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