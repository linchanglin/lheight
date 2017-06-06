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
        delBtnWidth: 75,


        inputShowed: false,
        inputVal: ""
    },
    //手指刚放到屏幕触发
    touchS: function (e) {
        console.log("touchS", e);
        console.log("touchS" + e);
        //判断是否只有一个触摸点
        if (e.touches.length == 1) {
            this.setData({
                //记录触摸起始位置的X坐标
                startX: e.touches[0].clientX
            });
        }
    },
    //触摸时触发，手指在屏幕上每移动一次，触发一次
    touchM: function (e) {
        let message_id = e.currentTarget.dataset.messageid;
        console.log("touchM:", e);
        console.log("M message_id:", message_id);
        console.log("touchM:" + e);
        var that = this
        if (e.touches.length == 1) {
            //记录触摸点位置的X坐标
            var moveX = e.touches[0].clientX;
            //计算手指起始点的X坐标与当前触摸点的X坐标的差值
            var disX = that.data.startX - moveX;
            //delBtnWidth 为右侧按钮区域的宽度
            var delBtnWidth = that.data.delBtnWidth;
            var txtStyle = "";
            if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
                txtStyle = "left:0px" + ";transition: left 0.3s;";
            } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
                txtStyle = "left:-" + disX + "px";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-" + delBtnWidth + "px";
                }
            }
            // txtStyle = txtStyle + ";transition: left 0.3s;"
            let messages = that.data.messages;
            for (let message of messages) {
                if (message.id == message_id) {
                    message.txtStyle = txtStyle
                }
            }
            that.setData({
                messages: messages,
            })
        }
    },
    touchE: function (e) {
        let message_id = e.currentTarget.dataset.messageid;

        console.log("touchE", e);
        console.log("touchE" + e);
        var that = this
        if (e.changedTouches.length == 1) {
            //手指移动结束后触摸点位置的X坐标
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = that.data.startX - endX;
            var delBtnWidth = that.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
            txtStyle = txtStyle + ";transition: left 0.3s;"
            let messages = that.data.messages;
            for (let message of messages) {
                if (message.id == message_id) {
                    message.txtStyle = txtStyle
                }
            }
            that.setData({
                messages: messages,
            })
        }
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
