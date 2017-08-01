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
            url: `https://collhome.com/life/apis/applets?search=${search}`,
            success: function (res) {
                console.log('applets', res.data.data);
                let applets = res.data.data;
                that.setData({
                    applets: applets
                })

                if (parameter == 'onLoad') {
                    let applets_nums = applets.length;
                    wx.setNavigationBarTitle({
                        title: `${applets_nums} 个校园服务号`
                    })
                }
            }
        })
    },
    navigateToApplet: function (e) {
        let id = e.currentTarget.dataset.id;
        let name = e.currentTarget.dataset.name;
        let if_applet = e.currentTarget.dataset.ifapplet;
        let appId = e.currentTarget.dataset.appid;
        if (if_applet == 1) {
            wx.navigateToMiniProgram({
                appId: appId,
            })
        } else {
            wx.navigateTo({
                url: `../aboutCollegeService/aboutCollegeService?service_id=${id}&service_name=${name}`,
            })
        }
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