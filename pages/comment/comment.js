import common from '../../utils/common.js';

Page({
    data: {},
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
    load_love: function () {
        let that = this;
        let url = 'https://collhome.com/apis/loves/' + that.data.love_id + '/comments';
        wx.request({
            url: url,
            success: function (res) {
                console.log('love', res.data)
                let love = res.data.data.love;
                let comments = res.data.data.comments;
                let last_comment_id;
                if (comments.length > 0) {
                    last_comment_id = comments[comments.length - 1].id;
                } else {
                    last_comment_id = 0;
                }
                that.setData({
                    love: love,
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
        let that = this;
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
                            old_comment.praise_nums++
                        } else {
                            old_comment.if_my_praise = 0
                            old_comment.praise_nums--
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
        let comment_id = e.currentTarget.dataset.commentid;
        wx.navigateTo({
            url: `../reply/reply?comment_id=${comment_id}`
        });
    },
    navigateToReply: function (e) {
        console.log('navigateToReply', e);
        let comment_id = e.target.dataset.commentid;
        console.log('comment_id', comment_id);
        let that = this;
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