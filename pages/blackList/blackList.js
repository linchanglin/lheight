Page({
    data: {
        // users: [

        //     {
        //         id: 1,
        //         avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAqNTRvyNObvC1OXmHCbOz1Ag7pFbVCZe7fCXviaOMHPffbn9rfVyibb8BA3icU2iaweXZ9LyTYtkMFw/0",
        //         nickname: 'you see'

        //     },
        //     {

        //         id: 2,
        //         avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAqNTRvyNObvC1OXmHCbOz1Ag7pFbVCZe7fCXviaOMHPffbn9rfVyibb8BA3icU2iaweXZ9LyTYtkMFw/0",
        //         nickname: '琳达'

        //     },
        //     {

        //         id: 3,
        //         avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAqNTRvyNObvC1OXmHCbOz1Ag7pFbVCZe7fCXviaOMHPffbn9rfVyibb8BA3icU2iaweXZ9LyTYtkMFw/0",
        //         nickname: 'you see'

        //     }

        // ],


        inputShowed: false,
        inputVal: ""
    },
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: `https://collhome.com/guangdong-zhongkainongye/apis/blacklists?wesecret=${wesecret}`,
            success: function (res) {
                console.log("load_inBlackListUsers res", res);
                that.setData({
                    users: res.data.data
                })
            }
        })
    },
    navigateToProfileShow: function (e) {
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: `../profileShow/profileShow?user_id=${user_id}`,
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

});
