function signIn() {
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
                                    wx.request({
                                        url: 'https://collhome.com/apis/register',
                                        method: 'POST',
                                        data: {
                                            code: code,
                                            encryptedData: res.encryptedData,
                                            iv: res.iv
                                        },
                                        success: function (res) {
                                            console.log('wesecret res', res);
                                            let wesecret = res.data;
                                            wx.setStorageSync('wesecret', wesecret);
                                            wx.request({
                                                url: 'https://collhome.com/apis/user?wesecret=' + wesecret,
                                                success: function (res) {
                                                    console.log('my_userInfo res', res)
                                                    let my_userInfo = res.data.data;
                                                    wx.setStorageSync('my_userInfo', my_userInfo);
                                                }
                                            })
                                        }
                                    })

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
}

function get_my_userInfo(wesecret) {
    wx.request({
        url: 'https://collhome.com/apis/user?wesecret=' + wesecret,
        success: function (res) {
            console.log('my_userInfo res', res)
            let my_userInfo = res.data.data;
            wx.setStorageSync('my_userInfo', my_userInfo);
        }
    })
}

function showLoveActionSheet(e) {
    return new Promise((resolve, reject) => {
        console.log('showLoveActionSheet', e);

        let user_id = e.currentTarget.dataset.loveuserid
        let user_nickname = e.currentTarget.dataset.loveusernickname;
        let love_id = e.currentTarget.dataset.loveid;
        let love_content = e.currentTarget.dataset.lovecontent;
        let love = `${user_nickname}: ${love_content}`;
        let itemList;

        let my_userInfo = wx.getStorageSync('my_userInfo');

        if (my_userInfo.id == user_id) {
            itemList = [love, '举报', '删除'];
        } else {
            itemList = [love, '举报']
        }
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                console.log('res.tapIndex', res.tapIndex)
                let index = res.tapIndex;
                if (index == 1) {
                    let love_contentt;
                    if (love_content.length > 50) {
                        love_contentt = ':  ' + love_content.substring(0, 50) + '...';
                    } else {
                        love_contentt = ':  ' + love_content;
                    }
                    wx.navigateTo({
                        url: `../badReportInput/badReportInput?user_id=${user_id}&user_nickname=${user_nickname}&love_id=${love_id}&love_content=${love_contentt}`
                    })
                } else if (index == 2) {
                    wx.showActionSheet({
                        itemList: ['删除表白'],
                        itemColor: '#ff0000',
                        success: function (res) {
                            if (res.tapIndex == 0) {

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
                                        wx.setStorageSync('board_loves_need_refresh_delete_love', love_id);
                                        wx.setStorageSync('hot_loves_need_refresh_delete_love', love_id);
                                        wx.setStorageSync('college_loves_need_refresh_delete_love', love_id);
                                        wx.setStorageSync('my_loves_need_refresh_delete_love', love_id);
                                        resolve(love_id);
                                    }
                                })
                            }
                        }
                    })
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })

    })
}

function showCommentActionSheet(e) {
    console.log('showCommentActionSheet', e);
    return new Promise((resolve, reject) => {
        let user_id = e.currentTarget.dataset.commentuserid
        let user_nickname = e.currentTarget.dataset.commentusernickname;
        let comment_id = e.currentTarget.dataset.commentid;
        let comment_content = e.currentTarget.dataset.commentcontent;
        let comment = `${user_nickname}: ${comment_content}`;
        let itemList;

        let my_userInfo = wx.getStorageSync('my_userInfo');

        if (my_userInfo.id == user_id) {
            itemList = [comment, '回复', '举报', '删除'];
        } else {
            itemList = [comment, '回复', '举报']
        }
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                console.log(res.tapIndex)

                let index = res.tapIndex;
                if (index == 1) {
                    wx.navigateTo({
                        url: `../replyInput/replyInput?comment_id=${comment_id}&user_id=${user_id}`
                    });
                } else if (index == 2) {
                    let comment_contentt;
                    if (comment_content.length > 50) {
                        comment_contentt = ':  ' + comment_content.substring(0, 50) + '...';
                    } else {
                        comment_contentt = ':  ' + comment_content;
                    }
                    wx.navigateTo({
                        url: `../badReportInput/badReportInput?user_id=${user_id}&user_nickname=${user_nickname}&comment_id=${comment_id}&comment_content=${comment_contentt}`
                    })
                } else if (index == 3) {
                    wx.showActionSheet({
                        itemList: ['删除评论'],
                        itemColor: '#ff0000',
                        success: function (res) {
                            if (res.tapIndex == 0) {
                                let wesecret = wx.getStorageSync('wesecret');
                                wx.request({
                                    url: 'https://collhome.com/apis/delete/comment',
                                    method: 'POST',
                                    data: {
                                        wesecret: wesecret,
                                        comment_id: comment_id
                                    },
                                    success: function (res) {
                                        console.log('delete comment success', res.data)
                                        resolve(comment_id);
                                    }
                                })
                            }
                        }
                    })
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    })
}

function showReplyActionSheet(e, comment_id) {
    console.log('showReplyActionSheet', e);
    return new Promise((resolve, reject) => {
        let user_id = e.currentTarget.dataset.replyuserid
        let user_nickname = e.currentTarget.dataset.replyusernickname;
        let reply_id = e.currentTarget.dataset.replyid;
        let reply_content = e.currentTarget.dataset.replycontent;
        let reply = `${user_nickname}: ${reply_content}`;
        let itemList;

        let my_userInfo = wx.getStorageSync('my_userInfo');

        if (my_userInfo.id == user_id) {
            itemList = [reply, '回复', '举报', '删除'];
        } else {
            itemList = [reply, '回复', '举报']
        }
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                console.log(res.tapIndex)

                let index = res.tapIndex;
                if (index == 1) {
                    wx.navigateTo({
                        url: `../replyInput/replyInput?comment_id=${comment_id}&user_id=${user_id}`
                    });
                } else if (index == 2) {
                    let reply_contentt;
                    if (reply_content.length > 50) {
                        reply_contentt = ':  ' + reply_content.substring(0, 50) + '...';
                    } else {
                        reply_contentt = ':  ' + reply_content;
                    }
                    wx.navigateTo({
                        url: `../badReportInput/badReportInput?user_id=${user_id}&user_nickname=${user_nickname}&reply_id=${reply_id}&reply_content=${reply_contentt}`
                    })
                } else if (index == 3) {
                    wx.showActionSheet({
                        itemList: ['删除评论'],
                        itemColor: '#ff0000',
                        success: function (res) {
                            if (res.tapIndex == 0) {
                                let wesecret = wx.getStorageSync('wesecret');
                                wx.request({
                                    url: 'https://collhome.com/apis/delete/reply',
                                    method: 'POST',
                                    data: {
                                        wesecret: wesecret,
                                        reply_id: reply_id
                                    },
                                    success: function (res) {
                                        console.log('delete reply success', res.data)
                                        resolve(reply_id);
                                    }
                                })
                            }
                        }
                    })
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    })
}

function praiseLove(e) {
    console.log('praiseLove e', e);
    return new Promise((resolve, reject) => {
        let love_id = e.currentTarget.dataset.loveid;
        let love_if_my_praise = e.currentTarget.dataset.loveifmypraise;
        let praise;
        if (love_if_my_praise == 0) {
            praise = 1;
        } else {
            praise = 0;
        }
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/apis/loves/' + love_id + '/praises',
            method: 'POST',
            data: {
                wesecret: wesecret,
                praise: praise
            },
            success: function (res) {
                console.log('praiseLove success res', res)
                console.log('praise', praise)
                resolve(love_id);
            }
        })
    })
}

function praiseComment(e) {
    console.log('praiseComment e', e);
    return new Promise((resolve, reject) => {
        let comment_id = e.currentTarget.dataset.commentid;
        let comment_if_my_praise = e.currentTarget.dataset.commentifmypraise;
        let praise;
        if (comment_if_my_praise == 0) {
            praise = 1;
        } else {
            praise = 0;
        }
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: `https://collhome.com/apis/comments/${comment_id}/praises`,
            method: 'POST',
            data: {
                wesecret: wesecret,
                praise: praise
            },
            success: function (res) {
                console.log('praiseComment success res', res)
                console.log('praise', praise)
                resolve(comment_id);
            }
        })
    })
}

module.exports = {
    signIn: signIn,
    get_my_userInfo: get_my_userInfo,
    showLoveActionSheet: showLoveActionSheet,
    showCommentActionSheet: showCommentActionSheet,
    showReplyActionSheet: showReplyActionSheet,
    praiseLove: praiseLove,
    praiseComment: praiseComment
}