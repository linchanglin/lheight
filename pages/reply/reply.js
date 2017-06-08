import common from '../../utils/common.js';

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
        let comment_id = options.comment_id;
        that.setData({
            love_id: love_id,
            comment_id: comment_id
        })

        that.load_comment();
        that.load_replies();
    },
    onShow: function () {
        let that = this;
        let replies_need_refresh_create_reply = wx.getStorageSync('replies_need_refresh_create_reply')
        if (replies_need_refresh_create_reply) {
            that.setData({
                page: 1
            })
            that.load_replies();
            wx.removeStorageSync('replies_need_refresh_create_reply')
        }
    },
    onShareAppMessage: function () {
        let that = this;
        let share_loveId = that.data.love_id;
        let share_commentId = that.data.comment_id;
        let share_userNickname = that.data.comment.userInfo.nickName;
        return {
            title: `分享${share_userNickname}的评论`,
            path: `/pages/reply/reply?love_id=${share_loveId}&comment_id=${share_commentId}`
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
            that.load_replies('add_page')
        }
    },
    load_comment: function () {
        let that = this;
        let comment_id = that.data.comment_id;
        let wesecret = wx.getStorageSync('wesecret');
        let comment_url;
        if (wesecret) {
            comment_url = `https://collhome.com/apis/comments/${comment_id}?wesecret=${wesecret}`;
        } else {
            comment_url = `https://collhome.com/apis/comments/${comment_id}?wesecret=`;
        }
        wx.request({
            url: comment_url,
            success: function (res) {
                console.log('comment', res.data.data)
                let comment = res.data.data;
                that.setData({
                    comment: comment,
                })
            }
        })
    },
    load_replies: function (parameter) {
        let that = this;
        let page = that.data.page;
        let comment_id = that.data.comment_id;
        let wesecret = wx.getStorageSync('wesecret');
        let replies_url;
        if (wesecret) {
            replies_url = `https://collhome.com/apis/comments/${comment_id}/replies?page=${page}&wesecret=${wesecret}`;
        } else {
            replies_url = `https://collhome.com/apis/comments/${comment_id}/replies?page=${page}&wesecret=`;
        }
        wx.request({
            url: replies_url,
            success: function (res) {
                console.log('replies', res.data.data)
                let replies = res.data.data;
                if (parameter && parameter == 'add_page') {
                    console.log("replies.length", replies.length)
                    if (replies.length == 0) {
                        that.setData({
                            reach_bottom: false,
                            page_no_data: true
                        })
                    } else {
                        let new_replies = that.data.replies.concat(replies);
                        let last_reply_id = new_replies[new_replies.length - 1].id;
                        that.setData({
                            replies: new_replies,
                            last_reply_id: last_reply_id
                        })
                        that.setData({
                            reach_bottom: false
                        })
                    }
                } else {
                    let last_reply_id;
                    if (replies.length > 0) {
                        last_reply_id = replies[replies.length - 1].id;
                    } else {
                        last_reply_id = 0;
                    }
                    that.setData({
                        replies: replies,
                        last_reply_id: last_reply_id
                    })
                }
            }
        })
    },
    navigateToProfileShow: function (e) {
        console.log('navigateToProfileShow', e);
        let that = this;
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: '../profileShow/profileShow?user_id=' + user_id
        })
    },
    showCommentActionSheet: function (e) {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        let love_id = that.data.love_id;
        if (wesecret) {
            if (my_userInfo) {
                common.showCommentActionSheet(e).then((comment_id) => {
                    console.log('delete comment_id', comment_id)
                    wx.setStorageSync('comments_need_refresh_delete_comment', comment_id);
                    wx.setStorageSync('board_loves_need_refresh', love_id);
                    wx.setStorageSync('hot_loves_need_refresh', love_id);
                    wx.setStorageSync('college_loves_need_refresh', love_id);
                    wx.setStorageSync('my_loves_need_refresh', love_id);
                    wx.navigateBack();
                });
            } else {
                common.get_my_userInfo(wesecret);
            }
        } else {
            common.signIn();
        }
    },
    showReplyActionSheet: function (e) {
        let that = this;
        let reply_id = e.currentTarget.dataset.replyid;
        that.setData({
            item_selected_reply_id: reply_id
        })
        setTimeout(function () {
            that.setData({
                item_selected_reply_id: ''
            })
        }, 200)

        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        let comment_id = that.data.comment_id;
        if (wesecret) {
            if (my_userInfo) {
                common.showReplyActionSheet(e, comment_id).then((reply_id) => {
                    console.log('delete reply_id', reply_id)
                    wx.setStorageSync('comments_need_refresh', comment_id);

                    that.load_comment();
                    that.load_refresh_replies_delete_reply(reply_id)
                });
            } else {
                common.get_my_userInfo(wesecret);
            }
        } else {
            common.signIn();
        }
    },
    load_refresh_replies_delete_reply: function (reply_id) {
        let that = this;
        let new_replies = [];
        let old_replies = that.data.replies;
        for (let old_reply of old_replies) {
            if (old_reply.id != reply_id) {
                new_replies.push(old_reply)
            }
        }

        let last_reply_id;
        if (new_replies.length > 0) {
            last_reply_id = new_replies[new_replies.length - 1].id;
        } else {
            last_reply_id = 0;
        }

        that.setData({
            replies: new_replies,
            last_reply_id: last_reply_id
        })
    },
    longtap_reply: function (e) {
        console.log('longtap_reply', e);
        let reply_id = e.currentTarget.dataset.replyid;
        let that = this;
        that.setData({
            item_selected_reply_id: reply_id
        })
    },
    touchmove_reply: function (e) {
        let that = this;
        that.setData({
            item_selected_reply_id: ''
        })
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
                let old_comment = that.data.comment;
                old_comment.praise_nums = parseInt(old_comment.praise_nums);
                if (comment_if_my_praise == 0) {
                    old_comment.if_my_praise = 1;
                    old_comment.praise_nums++;
                } else {
                    old_comment.if_my_praise = 0;
                    old_comment.praise_nums--;
                }
                that.setData({
                    comment: old_comment,
                    selected_comment_id: comment_id
                })
                wx.setStorageSync('comments_need_refresh', comment_id);
            });
        } else {
            common.signIn();
        }
    },
    praiseReply: function (e) {
        console.log('praiseReply e', e);
        let that = this
        let reply_id = e.currentTarget.dataset.replyid;
        let reply_if_my_praise = e.currentTarget.dataset.replyifmypraise;

        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
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
                    wesecret: wesecret,
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
            common.signIn();
        }
    }
})