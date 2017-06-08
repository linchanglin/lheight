// pages/praiseMeUser/praiseMeUser.js
Page({
    data: {
        inputShowed: false,
        inputVal: ""
    },
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: `https://collhome.com/apis/praiseMeUsers?wesecret=${wesecret}`,
            success: function (res) {
                console.log('praiseMeUsers', res.data.data);
                let praiseMeUsers = res.data.data;
                that.setData({
                    praiseMeUsers: praiseMeUsers
                })
            }
        })
    },
    navigateToProfileShow: function (e) {
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: '../profileShow/profileShow?user_id=' + user_id
        })
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },




})