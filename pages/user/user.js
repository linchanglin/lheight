import common from '../../utils/common.js';

Page({
    data: {
      // 测试用
      test_loves: [
        { id: 1, content: '北京大学，简称“北大”，诞生于1898年，初名京师大学堂，是中国近代第一所国立大学，也是最早以“大学”之名创办的学校，其成立标志着中国近代高等教育的开端。北大是中国近代以来唯一以国家最高学府身份创立的学校，最初也是国家最高教育行政机关，行使教育部职能，统管全国教育。北大催生了中国最早的现代学制，开创了中国最早的文科、理科、社科、农科、医科等大学学科，是近代以来中国高等教育的奠基者。' },
      ],



    },
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        if (wesecret && my_userInfo) {
            that.setData({
                wesecret: wesecret,
                userInfo: my_userInfo
            })
        }
        // else {
        //     common.signIn().then(() => {
        //         let wesecret = wx.getStorageSync('wesecret');
        //         let my_userInfo = wx.getStorageSync('my_userInfo');
        //         that.setData({
        //             wesecret: wesecret,
        //             userInfo: my_userInfo
        //         })
        //         that.get_unreadNoticeNums();
        //         that.get_unreadSystemNoticeNums();

        //     })
        // }
    },
    onShow: function () {
        let that = this;

        that.get_available();

        let user_need_refresh = wx.getStorageSync('user_need_refresh')
        if (user_need_refresh) {
            let my_userInfo = wx.getStorageSync('my_userInfo');
            that.setData({
                userInfo: my_userInfo
            })
            wx.removeStorageSync('user_need_refresh')
        }
        that.get_unreadNoticeNums();
        that.get_unreadMessages();
        that.get_unreadSystemNoticeNums();
    },
    get_available: function () {
        let that = this;
        wx.request({
            url: 'https://collhome.com/life/apis/get_availables',
            success: function (res) {
                let get_available = res.data.data;
                that.setData({
                    get_available: get_available
                })
            }
        })
    },
    onShareAppMessage: function () {
        let that = this;
        return {
            title: `分享校园生活墙`,
            path: `/pages/love/love`,
            success: function (res) {
                console.log("onShareAppMessage", res);
            }
        }
    },
    get_unreadNoticeNums: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.request({
                url: `https://collhome.com/life/apis/unreadNoticeNums?wesecret=${wesecret}`,
                success: function (res) {
                    console.log('unreadNoticeNums', res);
                    let unreadNoticeNums = res.data.unreadNoticeNums;
                    that.setData({
                        unreadNoticeNums: unreadNoticeNums
                    })
                }
            })
        }
    },
    get_unreadMessages: function () {
      let that = this;
      let wesecret = wx.getStorageSync('wesecret');
      if (wesecret) {
        wx.request({
          url: `https://collhome.com/life/apis/unreadMessages?wesecret=${wesecret}`,
          success: function (res) {
            console.log('unreadNoticeNums', res);
            let unreadMessages = res.data.unreadMessages;
            that.setData({
              unreadMessages: unreadMessages
            })
          }
        })
      }
    },
    get_unreadSystemNoticeNums: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.request({
                url: `https://collhome.com/life/apis/unreadSystemNoticeNums?wesecret=${wesecret}`,
                success: function (res) {
                    console.log('unreadSystemNoticeNums', res);
                    let unreadSystemNoticeNums = res.data.data.unreadSystemNoticeNums;
                    that.setData({
                        unreadSystemNoticeNums: unreadSystemNoticeNums
                    })
                }
            })
        }
    },
    navigateToProfileInput: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../profileInput/profileInput',
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadMessages();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../profileInput/profileInput',
                })
            });
        }
    },
    // navigateToRelatedApplet: function () {
    //     wx.navigateTo({
    //         url: '../relatedApplet/relatedApplet',
    //     })
    // },
    navigateToManage: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let unreadSystemNoticeNums = that.data.unreadSystemNoticeNums;
        if (wesecret) {
            wx.navigateTo({
                url: `../manage/manage?unreadSystemNoticeNums=${unreadSystemNoticeNums}`,
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadMessages();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: `../manage/manage?unreadSystemNoticeNums=${unreadSystemNoticeNums}`,
                })
            });
        }
    },
    navigateToPraiseMeUsers: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../praiseMeUser/praiseMeUser',
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadMessages();
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../praiseMeUser/praiseMeUser',
                })
            });
        }
    },
    navigateToMessage: function () {
      let that = this;
      let wesecret = wx.getStorageSync('wesecret');
      if (wesecret) {
        wx.navigateTo({
          url: '../message/message',
        })
      } else {
        common.signIn().then(() => {
          let my_userInfo = wx.getStorageSync('my_userInfo');
          that.setData({
            userInfo: my_userInfo
          })
          that.get_unreadNoticeNums();
          that.get_unreadMessages();
          that.get_unreadSystemNoticeNums();

          wx.navigateTo({
            url: '../message/message',
          })
        });
      }
    },

    navigateToMyCommentLove: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../myCommentLove/myCommentLove',
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadMessages();                
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../myCommentLove/myCommentLove',
                })
            });
        }
    },
    navigateToMyLove: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../myLove/myLove',
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadMessages();                
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../myLove/myLove',
                })
            });
        }
    },
    navigateToNotice: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            wx.navigateTo({
                url: '../notice/notice',
            })
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadMessages();                
                that.get_unreadSystemNoticeNums();

                wx.navigateTo({
                    url: '../notice/notice',
                })
            });
        }
    },
    navigateToLoveInput: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        if (wesecret) {
            let userInfo = that.data.userInfo;
            if (userInfo.available == 0) {
                that.showNoAvailableModal();
            } else {
                if (that.data.userInfo.college_id == '') {
                    that.showNoCollegeModal();
                } else {
                    wx.navigateTo({
                        url: '../loveInput/loveInput',
                    })
                }
            }
        } else {
            common.signIn().then(() => {
                let my_userInfo = wx.getStorageSync('my_userInfo');
                that.setData({
                    userInfo: my_userInfo
                })
                that.get_unreadNoticeNums();
                that.get_unreadMessages();                                
                that.get_unreadMessages();                
                
                that.get_unreadSystemNoticeNums();

                let userInfo = that.data.userInfo;
                if (userInfo.available == 0) {
                    that.showNoAvailableModal();
                } else {
                    if (that.data.userInfo.college_id == '') {
                        that.showNoCollegeModal();
                    } else {
                        wx.navigateTo({
                            url: '../loveInput/loveInput',
                        })
                    }
                }
            });
        }
    },
    showNoAvailableModal: function () {
        let that = this;
        let disabled_reason = that.data.userInfo.disabled_reason;
        wx.showModal({
            // title: '不能帖子',
            content: `您被禁止发帖，原因是: ${disabled_reason} 请去 我 -> 我的管理 -> 客服，联系客服解禁，或其他方式联系客服解禁！给您造成不便，谢谢您的谅解！`,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    showNoCollegeModal: function () {
        let that = this;
        wx.showModal({
            title: '未完善学校信息',
            content: '发帖需要知道您的学校呢，请去 我 -> 个人信息 -> 学校，选择您的学校！',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
});