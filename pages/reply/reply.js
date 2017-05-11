Page({
    data: {},

    onLoad: function (options) {
        console.log('options', options)
        let that = this;
        let comment_id = options.comment_id;

        that.setData({
            comment_id: comment_id
        })
        let scroll = options.scroll;
        if (scroll) {
            that.setData({
                scroll: scroll
            })
        }

        wx.getSystemInfo({
            success: (res) => {
                let wh = res.windowHeight;
                that.setData({
                    wh: wh - 45
                })
            }
        })

        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            that.setData({
                wesecret: wesecret
            })
            that.load_userInfo();
        }

        that.load_comment();
    },
    onReady: function () {
        let that = this;
        setTimeout(function () {
            that.setData({
                toView: that.data.scroll
            })
        }, 100)
    },
    onShow: function () {
        let that = this;
        let comment_need_refresh = wx.getStorageSync('comment_need_refresh')
        if (comment_need_refresh) {
            that.load_comment();
            wx.removeStorageSync('comment_need_refresh')
        }
    },
    load_comment: function () {
        let that = this;
        let comment_id = that.data.comment_id;
        let url = `https://collhome.com/apis/comments/${comment_id}/replies`

        wx.request({
            url: url,
            success: function (res) {
                console.log('comment', res.data.data)
                let comment = res.data.data;
                let replies = comment.replies;
                let last_reply_id = replies[replies.length - 1].id;
                console.log('last_reply_id', last_reply_id)
                that.setData({
                    comment: comment,
                    replies: comment.replies,
                    last_reply_id: last_reply_id
                })
            }
        })
    },
    load_userInfo: function () {
        var that = this;
        wx.request({
            url: 'https://collhome.com/apis/user?wesecret=' + that.data.wesecret,
            success: function (res) {
                console.log('user with wesecret', res.data)

                that.setData({
                    userInfo: res.data.data
                })
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
    navigateToCommentInput: function () {
        let that = this;
        if (that.data.wesecret) {
            wx.navigateTo({
                url: '../commentInput/commentInput?love_id=' + that.data.love_id
            })
        } else {
            that.signIn();
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

        console.log('location', location);

        wx.openLocation({
            name: location.name,
            address: location.address,
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude)
            // scale: 28
        })
    },
    showReplyActionSheet: function (e) {
        console.log('showReplyActionSheet', e);
        let nickname = e.currentTarget.dataset.replyusernickname;
        let content = e.currentTarget.dataset.replycontent;
        let reply = `${nickname}: ${content}`
        wx.showActionSheet({
            itemList: [reply, '回复', '举报', '删除'],
            // itemColor: '#ff0000',
            success: function (res) {
                console.log(res.tapIndex)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    navigateToReplys: function (e) {
        console.log('navigateToReplys', e);
        let comment_id = e.currentTarget.dataset.commentid;

        wx.navigateTo({
            url: `../reply/reply?comment_id=${comment_id}`
        });
    },
    navigateToReply: function (e) {
        console.log('navigateToReply', e);
        let comment_id = e.target.dataset.commentid;
        console.log('comment_id', comment_id);

        var that = this;
        that.setData({
            item_selected_comment_id: comment_id
        })

        setTimeout(function () {
            that.setData({
                item_selected_comment_id: ''
            })
        }, 450)

        wx.navigateTo({
            url: `../reply/reply?comment_id=${comment_id}`
        });
    },
    navigateToReplyInput: function (e) {
        console.log('navigateToReplyInput e', e);

        let comment_id = e.currentTarget.dataset.commentid;
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: `../replyInput/replyInput?comment_id=${comment_id}&user_id=${user_id}`
        });
    },
    praiseComment: function (e) {
        console.log('praiseComment e', e);
        console.log('this.data.comment', this.data.comment);
        let that = this
        let comment_id = e.currentTarget.dataset.commentid;
        let comment_if_my_praise = e.currentTarget.dataset.commentifmypraise;

        if (that.data.wesecret) {
            let praise;
            if (comment_if_my_praise == 0) {
                praise = 1;
            } else {
                praise = 0;
            }
            wx.request({
                url: `https://collhome.com/apis/comments/${comment_id}/praises`,
                method: 'POST',
                data: {
                    wesecret: that.data.wesecret,
                    praise: praise
                },
                success: function (res) {
                    let old_comment = that.data.comment;
                    old_comment.praise_nums = parseInt(old_comment.praise_nums);

                    if (comment_if_my_praise == 0) {
                        old_comment.if_my_praise = 1;
                        old_comment.praise_nums++
                    } else {
                        old_comment.if_my_praise = 0
                        old_comment.praise_nums--
                    }

                    that.setData({
                        comment: old_comment,
                        selected_comment_id: comment_id
                    })

                    wx.setStorageSync('love_need_refresh', 1);
                }
            })
        } else {
            that.signIn();
        }
    },
    praiseReply: function (e) {
        console.log('praiseReply e', e);
        console.log('this.data.replies', this.data.replies);
        let that = this
        let reply_id = e.currentTarget.dataset.replyid;
        let reply_if_my_praise = e.currentTarget.dataset.replyifmypraise;

        if (that.data.wesecret) {
            let praise;
            if (reply_if_my_praise == 0) {
                praise = 1;
            } else {
                praise = 0;
            }
            wx.request({
                url: `https://collhome.com/apis/replies/${reply_id}/praises`,
                method: 'POST',
                data: {
                    wesecret: that.data.wesecret,
                    praise: praise
                },
                success: function (res) {
                    console.log('praiseReply res', res);
                    let old_replies = that.data.replies;
                    for (let old_reply of old_replies) {
                        if (old_reply.id == reply_id) {
                            old_reply.praise_nums = parseInt(old_reply.praise_nums);

                            if (reply_if_my_praise == 0) {
                                old_reply.if_my_praise = 1;
                                old_reply.praise_nums++
                            } else {
                                old_reply.if_my_praise = 0
                                old_reply.praise_nums--
                            }
                        }
                    }
                    that.setData({
                        replies: old_replies,
                        selected_reply_id: reply_id
                    })
                }
            })
        } else {
            that.signIn();
        }
    },
    signIn: function () {
        let that = this;
        wx.showModal({
            title: '提示',
            content: '您还未登录呢，立即使用微信登录!',
            confirmText: '确定',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')

                    wx.login({
                        success: (res) => {
                            const code = res.code
                            if (code) {
                                wx.getUserInfo({
                                    success: (res) => {
                                        console.log('res', res);
                                        console.log('code', code, 'encryptedData', res.encryptedData, 'iv', res.iv)
                                        that.postRegister(code, res.encryptedData, res.iv);
                                    }
                                })
                            } else {
                                console.log('获取用户登录态失败！' + res.errMsg)
                            }
                        }
                    });
                }
            }
        })
    },
    postRegister: function (code, encryptedData, iv) {
        let that = this;

        wx.request({
            url: 'https://collhome.com/apis/register',
            method: 'POST',
            data: {
                code: code,
                encryptedData: encryptedData,
                iv: iv
            },
            success: function (res) {
                console.log('res', res);

                wx.setStorageSync('wesecret', res.data);
                that.setData({
                    wesecret: res.data,
                })
                that.load_userInfo();
            }
        })
    },
    deleteArticle: function () {
        let that = this;
        wx.showModal({
            title: '删除',
            content: '您要删除这条表白吗？',
            confirmColor: '#ff0000',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')

                    wx.request({
                        url: 'https://collhome.com/apis/delete/love',
                        method: 'POST',
                        data: {
                            wesecret: that.data.wesecret,
                            love_id: that.data.love_id
                        },
                        success: function (res) {
                            console.log('delete love success', res.data)
                            wx.setStorageSync('board_loves_need_refresh', 1);
                            wx.setStorageSync('hot_loves_need_refresh', 1);
                            wx.setStorageSync('college_loves_need_refresh', 1);
                            wx.setStorageSync('my_loves_need_refresh', 1);
                            wx.navigateBack()
                        }
                    })
                }
            }
        })
    }
})