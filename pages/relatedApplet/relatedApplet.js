// pages/praiseMeUser/praiseMeUser.js
Page({
    data: {
        inputShowed: false,
        inputVal: ""
    },
    onLoad: function () {
        let that = this;
        that.load_applets('onLoad');
    },
    load_applets: function (parameter) {
        let that = this;
        let search = that.data.inputVal;
        wx.request({
            url: `https://collhome.com/shanghai/apis/applets?search=${search}`,
            success: function (res) {
                console.log('applets', res.data.data);
                let applets = res.data.data;
                that.setData({
                    applets: applets
                })

                if (parameter == 'onLoad') {
                    let applets_nums = applets.length;
                    wx.setNavigationBarTitle({
                        title: `${applets_nums} 个相关小程序`
                    })
                }
            }
        })
    },
    navigateToApplet: function (e) {
        let appId = e.currentTarget.dataset.appid;
        wx.navigateToMiniProgram({
            appId: appId,
            success(res) {
                // 打开成功
                console.log('navigateToApplet res', res);
            }
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
        that.load_applets();
    }

})