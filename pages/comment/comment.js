import common from '../../utils/common.js';
var app = getApp()

Page({
    data: {
        page: 1,
        reach_bottom: false,
        page_no_data: false,
    },
    onLoad: function (options) {
        console.log('options', options)
        let that = this;
        let love_id = options.love_id;
        that.setData({
            love_id: love_id
        })

        let ww = app.data.deviceInfo.windowWidth - 20;
        let image_width = (ww - 2) / 3;
        that.setData({
            ww: ww,
            image_width: image_width
        })

        that.load_love();
        that.load_comments();
    },
    onShow: function () {
        let that = this;

        let comments_need_refresh = wx.getStorageSync('comments_need_refresh')
        if (comments_need_refresh) {
            that.load_refresh_comments(comments_need_refresh);
            wx.removeStorageSync('comments_need_refresh')
        }
        let comments_need_refresh_delete_comment = wx.getStorageSync('comments_need_refresh_delete_comment')
        if (comments_need_refresh_delete_comment) {
            that.load_refresh_comments_delete_comment(comments_need_refresh_delete_comment);
            wx.removeStorageSync('comments_need_refresh_delete_comment')
        }
        let comments_need_refresh_create_comment = wx.getStorageSync('comments_need_refresh_create_comment')
        if (comments_need_refresh_create_comment) {
            that.setData({
                page: 1
            })
            that.load_love();
            that.load_comments();
            wx.removeStorageSync('comments_need_refresh_create_comment')
        }

    },
    load_refresh_comments: function (need_refresh_comment_id) {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let url;
        if (wesecret) {
            url = `https://collhome.com/apis/comments/${need_refresh_comment_id}?wesecret=${wesecret}`
        } else {
            url = `https://collhome.com/apis/comments/${need_refresh_comment_id}`
        }
        wx.request({
            url: url,
            success: function (res) {
                console.log("load_refresh_comments res", res.data.data)
                let the_refresh_comment = res.data.data;
                let old_comments = that.data.comments;
                for (let old_comment of old_comments) {
                    if (old_comment.id == need_refresh_comment_id) {
                        // old_comment = the_refresh_comment
                        old_comment.praise_nums = the_refresh_comment.praise_nums;
                        old_comment.comment_nums = the_refresh_comment.comment_nums;
                        old_comment.if_my_comment = the_refresh_comment.if_my_comment;
                        old_comment.if_my_praise = the_refresh_comment.if_my_praise;
                        old_comment.replies = the_refresh_comment.replies;
                        old_comment.reply_nums = the_refresh_comment.reply_nums;
                    }
                }
                console.log('load_refresh_comments old_comments', old_comments);
                that.setData({
                    comments: old_comments
                })
            }
        })
    },
    load_refresh_comments_delete_comment: function (comment_id) {
        let that = this;
        let old_comments = that.data.comments;
        let new_comments = [];
        for (let old_comment of old_comments) {
            if (old_comment.id != comment_id) {
                new_comments.push(old_comment)
            }
        }

        let last_comment_id;
        if (new_comments.length > 0) {
            last_comment_id = new_comments[new_comments.length - 1].id;
        } else {
            last_comment_id = 0;
        }

        that.setData({
            comments: new_comments,
            last_comment_id: last_comment_id
        })
    },
    onShareAppMessage: function () {
        let that = this;
        let share_loveId = that.data.love_id;
        let share_userNickname = that.data.love.userInfo.nickName;
        return {
            title: `分享${share_userNickname}的表白`,
            path: `/pages/comment/comment?love_id=${share_loveId}`
        }
    },
    onReachBottom: function () {
        console.log('onReachBottom')

        let that = this;
        if (!that.data.page_no_data) {
            that.setData({
                reach_bottom: true,
                page_no_data: false,
                page: that.data.page + 1
            })
            that.load_comments('add_page')
        }
    },
    load_love: function () {
        let that = this;
        let love_id = that.data.love_id;
        let wesecret = wx.getStorageSync('wesecret');
        let love_url;
        if (wesecret) {
            love_url = `https://collhome.com/apis/loves/${love_id}?wesecret=${wesecret}`;
        } else {
            love_url = `https://collhome.com/apis/loves/${love_id}?wesecret=`;
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
    },
    load_comments: function (parameter) {
        let that = this;
        let page = that.data.page;
        let love_id = that.data.love_id;
        let wesecret = wx.getStorageSync('wesecret');
        let comments_url;
        if (wesecret) {
            comments_url = `https://collhome.com/apis/loves/${love_id}/comments?page=${page}&wesecret=${wesecret}`
        } else {
            comments_url = `https://collhome.com/apis/loves/${love_id}/comments?page=${page}&wesecret=`;
        }
        wx.request({
            url: comments_url,
            success: function (res) {
                console.log("comments", res)
                let comments = res.data.data;
                if (parameter && parameter == 'add_page') {
                    console.log("comments.length", comments.length)
                    if (comments.length == 0) {
                        that.setData({
                            reach_bottom: false,
                            page_no_data: true
                        })
                    } else {
                        let new_comments = that.data.comments.concat(comments);
                        let last_comment_id = new_comments[new_comments.length - 1].id;
                        that.setData({
                            comments: new_comments,
                            last_comment_id: last_comment_id
                        })
                        that.setData({
                            reach_bottom: false
                        })
                    }
                } else {
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
                    that.load_refresh_comments_delete_comment(comment_id)
                    // that.load_comments();
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