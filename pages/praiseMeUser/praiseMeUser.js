// pages/praiseMeUser/praiseMeUser.js
Page({
    data: {
        inputShowed: false,
        inputVal: ""
    },
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        that.setData({
            wesecret: wesecret
        })
        that.load_praiseMeUsers('onLoad');
    },
    load_praiseMeUsers: function (parameter) {
        let that = this;
        let wesecret = that.data.wesecret;
        let search = that.data.inputVal;
        wx.request({
            url: `https://collhome.com/beijing/apis/praiseMeUsers?wesecret=${wesecret}&search=${search}`,
            success: function (res) {
                console.log('praiseMeUsers', res.data.data);
                let praiseMeUsers = res.data.data;
                that.setData({
                    praiseMeUsers: praiseMeUsers
                })

                if (parameter == 'onLoad') {
                    let user_nums = praiseMeUsers.length;
                    wx.setNavigationBarTitle({
                        title: `${user_nums} 人喜欢我`
                    })
                }
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
    searchInputConfirm: function (e) {
        let that = this;
        that.load_praiseMeUsers();
    }

})