import common from '../../utils/common.js';

Page({
    data: {
        // page: 1,
        // reach_bottom: false,
        // page_no_data: false,
    },
    onLoad: function (options) {
        console.log('options', options)
        let that = this;
        let love_id = options.love_id;
        that.setData({
            love_id: love_id
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

        that.load_love();

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
        let love_need_refresh = wx.getStorageSync('love_need_refresh')
        if (love_need_refresh) {
            that.load_love();
            wx.removeStorageSync('love_need_refresh')
        }
    },
    onShareAppMessage: function () {
        let that = this;
        let love_id = that.data.love_id;
        return {
            title: '表白',
            path: `/pages/comment/comment?love_id=${love_id}`
        }
    },
    load_love: function () {
        let that = this;
        let love_id = that.data.love_id;
        let page = that.data.page;
        let wesecret = wx.getStorageSync('wesecret');
        let love_url;
        let comments_url;
        if (wesecret) {
            love_url = `https://collhome.com/apis/loves/${love_id}?wesecret=${wesecret}`;
            comments_url = `https://collhome.com/apis/loves/${love_id}/comments?page=${page}&wesecret=${wesecret}`
        } else {
            love_url = `https://collhome.com/apis/loves/${love_id}?wesecret=`;
            comments_url = `https://collhome.com/apis/loves/${love_id}/comments?page=${page}&wesecret=`;            
        }
        wx.request({
            url: love_url,
            success: function (res) {
                console.log("love", res)
                let love = res.data.data;
                that.setData({
                    love: love
                })
            }
        })
        wx.request({
            url: comments_url,
            success: function (res) {
                console.log("comments", res)
                let comments = res.data.data;
                let last_comment_id;
                if (comments.length > 0) {
                    last_comment_id = comments[comments.length - 1].id;
                } else {
                    last_comment_id = 0;
                }
                that.setData({
                    comments: comments,
                    last_comment_id: last_comment_id
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
    showLoveActionSheet: function (e) {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        if (wesecret) {
            if (my_userInfo) {
                common.showLoveActionSheet(e).then((love_id) => {
                    console.log('delete love_id', love_id)
                    wx.navigateBack()
                });
            } else {
                common.get_my_userInfo(wesecret);
            }
        } else {
            common.signIn();
        }
    },
    showCommentActionSheet: function (e) {
        console.log('showCommentActionSheet', e);
        let comment_id = e.currentTarget.dataset.commentid;
        let that = this;
        that.setData({
            item_selected_comment_id: comment_id
        })
        setTimeout(function () {
            that.setData({
                item_selected_comment_id: ''
            })
        }, 200)

        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        if (wesecret) {
            if (my_userInfo) {
                common.showCommentActionSheet(e).then((comment_id) => {
                    console.log('delete comment_id', comment_id)
                    let love_id = that.data.love_id;
                    wx.setStorageSync('board_loves_need_refresh', love_id);
                    wx.setStorageSync('hot_loves_need_refresh', love_id);
                    wx.setStorageSync('college_loves_need_refresh', love_id);
                    wx.setStorageSync('my_loves_need_refresh', love_id);
                    that.load_love();
                });
            } else {
                common.get_my_userInfo(wesecret);
            }
        } else {
            common.signIn();
        }
    },
    longtap_comment: function (e) {
        console.log('longtap_comment', e);
        let comment_id = e.currentTarget.dataset.commentid;
        var that = this;
        that.setData({
            item_selected_comment_id: comment_id
        })
    },
    touchmove_comment: function (e) {
        let that = this;
        that.setData({
            item_selected_comment_id: ''
        })
    },
    praiseLove: function (e) {
        let love_if_my_praise = e.currentTarget.dataset.loveifmypraise;
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            common.praiseLove(e).then((love_id) => {
                let old_love = that.data.love;
                old_love.praise_nums = parseInt(old_love.praise_nums);
                if (love_if_my_praise == 0) {
                    old_love.if_my_praise = 1;
                    old_love.praise_nums++
                } else {
                    old_love.if_my_praise = 0
                    old_love.praise_nums--
                }
                that.setData({
                    love: old_love,
                    selected_love_id: love_id
                })
                wx.setStorageSync('board_loves_need_refresh', love_id);
                wx.setStorageSync('my_loves_need_refresh', love_id);
            });
        } else {
            common.signIn();
        }
    },
    praiseComment: function (e) {
        let comment_if_my_praise = e.currentTarget.dataset.commentifmypraise;
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            common.praiseComment(e).then((comment_id) => {
                let old_comments = that.data.comments;
                for (let old_comment of old_comments) {
                    if (old_comment.id == comment_id) {
                        old_comment.praise_nums = parseInt(old_comment.praise_nums);

                        if (comment_if_my_praise == 0) {
                            old_comment.if_my_praise = 1;
                            old_comment.praise_nums++;
                        } else {
                            old_comment.if_my_praise = 0;
                            old_comment.praise_nums--;
                        }
                    }
                }
                that.setData({
                    comments: old_comments,
                    selected_comment_id: comment_id
                })
            });
        } else {
            common.signIn();
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
    navigateToProfileShowInReply: function (e) {
        console.log('navigateToProfileShowInReply', e)
        let that = this;
        let reply = e.currentTarget.dataset.reply;
        let type = e.currentTarget.dataset.type;
        let toUserId = e.currentTarget.dataset.touserid;
        if (type == 'user') {
            that.setData({
                item_selected_reply_id: reply.id,
                item_selected_reply_userInfo_id: reply.userInfo.id,
            })
        } else {
            that.setData({
                item_selected_reply_id: reply.id,
                item_selected_reply_objectUserInfo_id: reply.objectUserInfo.id,
            })
        }
        setTimeout(function () {
            that.setData({
                item_selected_reply_id: '',
                item_selected_reply_userInfo_id: '',
                item_selected_reply_objectUserInfo_id: '',
            })
        }, 450)
        wx.navigateTo({
            url: '../profileShow/profileShow?user_id=' + toUserId
        })
    },
    navigateToLocation: function (e) {
        console.log('location', e);
        let location = e.currentTarget.dataset.location;
        wx.openLocation({
            name: location.name,
            address: location.address,
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude)
            // scale: 28
        })
    },
    navigateToReplys: function (e) {
        console.log('navigateToReplys', e);
        let that = this;
        let love_id = that.data.love_id;
        let comment_id = e.currentTarget.dataset.commentid;
        wx.navigateTo({
            url: `../reply/reply?love_id=${love_id}&comment_id=${comment_id}`
        });
    },
    navigateToReply: function (e) {
        console.log('navigateToReply', e);
        let that = this;
        let love_id = that.data.love_id;
        let comment_id = e.target.dataset.commentid;
        console.log('comment_idddd', comment_id);
        that.setData({
            item_reply_selected_comment_id: comment_id,
        })
        setTimeout(function () {
            that.setData({
                item_reply_selected_comment_id: ''
            })
        }, 450)
        wx.navigateTo({
            url: `../reply/reply?love_id=${love_id}&comment_id=${comment_id}`
        });
    },
    navigateToCommentInput: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../commentInput/commentInput?love_id=' + that.data.love_id
            })
        } else {
            common.signIn();
        }
    },
    navigateToReplyInput: function (e) {
        console.log('navigateToReplyInput e', e);
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            let comment_id = e.currentTarget.dataset.commentid;
            let user_id = e.currentTarget.dataset.userid;
            wx.navigateTo({
                url: `../replyInput/replyInput?comment_id=${comment_id}&user_id=${user_id}`
            });
        }
        else {
            common.signIn();
        }
    },
})