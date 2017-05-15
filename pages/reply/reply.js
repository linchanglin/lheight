import common from '../../utils/common.js';

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
    previewImage: function (e) {
        console.log('preview e', e);
        var current = e.currentTarget.dataset.current;
        var urls = e.currentTarget.dataset.urls;

        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
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

    // 。。。就差这个了
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
                    old_comment.praise_nums++
                } else {
                    old_comment.if_my_praise = 0
                    old_comment.praise_nums--
                }
                that.setData({
                    comment: old_comment,
                    selected_comment_id: comment_id
                })
                wx.setStorageSync('love_need_refresh', comment_id);
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