Page({
    data: {
        messages: [
            {
                id: 1,
                userInfo: {
                    id: 1,
                    avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAqNTRvyNObvC1OXmHCbOz1Ag7pFbVCZe7fCXviaOMHPffbn9rfVyibb8BA3icU2iaweXZ9LyTYtkMFw/0",
                    nickName: 'you see'
                },
                unreadMessageNums: 3,
                lastUnreadMessage: '什么时候',
            },
            {
                id: 2,
                userInfo: {
                    id: 1,
                    avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAqNTRvyNObvC1OXmHCbOz1Ag7pFbVCZe7fCXviaOMHPffbn9rfVyibb8BA3icU2iaweXZ9LyTYtkMFw/0",
                    nickName: '琳达'
                },
                unreadMessageNums: 5,
                lastUnreadMessage: '可以',
            },
            {
                id: 3,
                userInfo: {
                    id: 1,
                    avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAqNTRvyNObvC1OXmHCbOz1Ag7pFbVCZe7fCXviaOMHPffbn9rfVyibb8BA3icU2iaweXZ9LyTYtkMFw/0",
                    nickName: 'you see'
                },
                unreadMessageNums: 7,
                lastUnreadMessage: '哈哈',
            }

        ],


        inputShowed: false,
        inputVal: ""
    },

    navigateToChat: function (e) {
        wx.navigateTo({
            url: '../chat/chat',
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
