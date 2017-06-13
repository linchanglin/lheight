Page({
    data: { },
    onLoad: function (option) {
        console.log('options', option);
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        that.setData({
            user_id: option.user_id,
            wesecret: wesecret
        })
        that.load_user();
    },
    load_user: function () {
        let that = this;
        let user_id = that.data.user_id;
        let wesecret = that.data.wesecret;
        wx.request({
            url: `https://collhome.com/apis/users/${user_id}?wesecret=${wesecret}` ,
            success: function (res) {
                console.log('userInfo', res.data.data)
                let userInfo = res.data.data;
                let inMyBlackList;
                if (userInfo.inMyBlackList == 1) {
                    inMyBlackList = true;
                } else {
                    inMyBlackList = false;
                }
                that.setData({
                    userInfo: userInfo,
                    inMyBlackList: inMyBlackList
                })
            }
        })
    },
    navigateBadReportInput: function () {
        let that = this;
        let user_id = that.data.user_id;
        let user_nickname = that.data.userInfo.nickname;
        wx.navigateTo({
            url: `../badReportInput/badReportInput?user_id=${user_id}&user_nickname=${user_nickname}`,
        })
    },
    putInBlacklists: function (e) {
        console.log("putInBlacklists e", e);
        let that = this;
        let value = e.detail.value;
        if (value) {
            that.setData({
                inBlacklists: 1
            })
        } else {
            that.setData({
                inBlacklists: 0
            })
        }
        that.postPutInBlacklists();
    },
    postPutInBlacklists: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/apis/blacklists',
            method: 'POST',
            data: {
                wesecret: wesecret,
                objectUser_id: that.data.user_id,
                inBlacklists: that.data.inBlacklists
            },
            success: function (res) {
                console.log('success res', res);
            }
        })
    }
});