import common from '../../utils/common.js'

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
                let ww = res.windowWidth;
                var length = 3;
                var row = Math.ceil(length / 3);
                var line = Math.ceil(length / row);
                var widthM = ww - 20;
                var widthX = (widthM / line).toFixed(2) - 6;
                var margin = "3px";
                that.setData({
                    imgCss: {
                        width: widthX + 'px',
                        height: widthX + 'px',
                        margin: margin
                    }
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
            that.load_loves();
            wx.removeStorageSync('board_loves_need_refresh')
        }

        that.setData({
            showTopTips1: true
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

    // 需要调整
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


                // if (parameter) {
                //   if (parameter == 'pulldown') {
                //     wx.stopPullDownRefresh();
                //   } else if (parameter == 'onLoad') {
                //     wx.hideLoading()
                //   }
                // }

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
    showLoveActionSheet: function (e) {
        console.log('showLoveActionSheet', e);
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            let user_id = e.currentTarget.dataset.loveuserid
            let user_nickname = e.currentTarget.dataset.loveusernickname;
            let love_id = e.currentTarget.dataset.loveid;
            let love_content = e.currentTarget.dataset.lovecontent;
            let love = `${user_nickname}: ${love_content}`;
            let itemList;
            if (that.data.userInfo.id == user_id) {
                itemList = [love, '评论', '举报', '删除'];
            } else {
                itemList = [love, '评论', '举报']
            }
            wx.showActionSheet({
                itemList: itemList,
                success: function (res) {
                    console.log(res.tapIndex)

                    let index = res.tapIndex;
                    if (index == 1) {
                        wx.navigateTo({
                            url: `../replyInput/replyInput?love_id=${love_id}&user_id=${user_id}`
                        });
                    } else if (index == 2) {
                        let love_contentt;
                        if (love_content.length > 50) {
                            love_contentt = ':  ' + love_content.substring(0, 50) + '...';
                        } else {
                            love_contentt = ':  ' + love_content;
                        }
                        wx.navigateTo({
                            url: `../badReportInput/badReportInput?user_id=${user_id}&user_nickname=${user_nickname}&love_id=${love_id}&love_content=${love_contentt}`
                        })
                    } else if (index == 3) {
                        wx.showActionSheet({
                            itemList: ['删除表白'],
                            itemColor: '#ff0000',
                            success: function (res) {
                                if (res.tapIndex == 0) {
                                    that.deleteLove(love_id);
                                }
                            }
                        })
                    }
                },
                fail: function (res) {
                    console.log(res.errMsg)
                }
            })
        } else {
            common.signIn();
        }
    },
    deleteLove: function (love_id) {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/apis/delete/love',
            method: 'POST',
            data: {
                wesecret: wesecret,
                love_id: love_id
            },
            success: function (res) {
                console.log('delete love success', res.data)
                wx.setStorageSync('board_loves_need_refresh', 1);
                wx.setStorageSync('hot_loves_need_refresh', 1);
                wx.setStorageSync('college_loves_need_refresh', 1);
                wx.setStorageSync('my_loves_need_refresh', 1);
                that.load_love();
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
        console.log('love_id', love_id);

        var that = this;
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
    praiseLove: function (e) {
        console.log('praiseLove e', e);
        let love_id = e.currentTarget.dataset.loveid;
        let love_if_my_praise = e.currentTarget.dataset.loveifmypraise;

        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            let praise;
            if (love_if_my_praise == 0) {
                praise == 1;
            } else {
                praise == 0;
            }
            wx.request({
                url: 'https://collhome.com/apis/loves/' + love_id + '/praises',
                method: 'POST',
                data: {
                    wesecret: wesecret,
                    praise: praise
                },
                success: function (res) {
                    console.log('1231654', res.data)

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
                }
            })
        } else {
            common.signIn();
        }
    },
    //   signIn: function () {
    //     let that = this;
    //     wx.showModal({
    //       title: '提示',
    //       content: '您还未登录呢，立即使用微信登录!',
    //       confirmText: '确定',
    //       success: function (res) {
    //         if (res.confirm) {
    //           console.log('用户点击确定')

    //           wx.login({
    //             success: (res) => {
    //               const code = res.code
    //               if (code) {
    //                 wx.getUserInfo({
    //                   success: (res) => {
    //                     console.log('res', res);
    //                     console.log('code', code, 'encryptedData', res.encryptedData, 'iv', res.iv)
    //                     that.postRegister(code, res.encryptedData, res.iv);
    //                   }
    //                 })
    //               } else {
    //                 console.log('获取用户登录态失败！' + res.errMsg)
    //               }
    //             }
    //           });
    //         }
    //       }
    //     })
    //   },
    //   postRegister: function (code, encryptedData, iv) {
    //     let that = this;

    //     wx.request({
    //       url: 'https://collhome.com/apis/register',
    //       method: 'POST',
    //       data: {
    //         code: code,
    //         encryptedData: encryptedData,
    //         iv: iv
    //       },
    //       success: function (res) {
    //         console.log('res', res);

    //         wx.setStorageSync('wesecret', res.data);
    //         that.setData({
    //           wesecret: res.data,
    //         })
    //       }
    //     })
    //   },
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
