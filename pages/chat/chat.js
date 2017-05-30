Page({
    data: {
        userInfo: {},
        message: [],
        inputMsg: "",
        scrollTop: 0
    },
    onLoad: function (options) {
        let that = this;
        let my_userInfo = wx.getStorageSync('my_userInfo');

        that.setData({
            userInfo: my_userInfo
        })

        wx.getSystemInfo({
            success: (res) => {
                let wh = res.windowHeight;
                that.setData({
                    wh: wh - 45
                })
            }
        })

        var message = wx.getStorageSync('message');
        var top = message.length * 100;
        this.setData({
            message: message || [],
            scrollTop: top
        })

    },
   
    onUnload: function () {
        wx.setStorageSync('message', this.data.message);
    },
    inputMsg: function (e) {
        this.setData({
            inputMsg: e.detail.value
        })
    },
    sendMessage: function (e) {
        this.setData({
            inputMsg: e.detail.value
        })
        var that = this;
        if (this.data.inputMsg != "") {
            var msg = { type: 0, src: this.data.userInfo.avatarUrl, content: this.data.inputMsg };
            //发送信息
            that.setMessage(msg);

            //回复
            var reply = { type: 1, src: "http://www.tuling123.com/resources/web/v4/img/personalCen/icon40.png", content: "这是测试的回复测试测试测试测试测试哟哟哟哟" };
            that.setMessage(reply);
            that.setData({
                scrollTop: that.data.scrollTop + 300
            })

            //回复
            // wx.request({
            //   url: "https://api.getweapp.com/vendor/tuling123/api",
            //   header: { "Content-type": "application/json" },
            //   data: { info: msg.content },
            //   success: function (data) {
            //     var reply = { type: 1, src: "http://www.tuling123.com/resources/web/v4/img/personalCen/icon40.png", content: data.data.text };
            //     that.setMessage(reply);
            //     that.setData({
            //       scrollTop: that.data.scrollTop + 300
            //     })
            //   }
            // })
        }
    },
    setMessage: function (msg) {
        var msgList = this.data.message;
        msgList.push(msg);
        this.setData({
            message: msgList,
            inputMsg: "",
        })
    },
    confirmInput: function () {
        this.sendMessage();
    }
})