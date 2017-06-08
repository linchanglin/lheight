Page({
    data: {
        users: [

            {
                id: 1,
                avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAqNTRvyNObvC1OXmHCbOz1Ag7pFbVCZe7fCXviaOMHPffbn9rfVyibb8BA3icU2iaweXZ9LyTYtkMFw/0",
                nickName: 'you see'

            },
            {

                id: 2,
                avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAqNTRvyNObvC1OXmHCbOz1Ag7pFbVCZe7fCXviaOMHPffbn9rfVyibb8BA3icU2iaweXZ9LyTYtkMFw/0",
                nickName: '琳达'

            },
            {

                id: 3,
                avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJAqNTRvyNObvC1OXmHCbOz1Ag7pFbVCZe7fCXviaOMHPffbn9rfVyibb8BA3icU2iaweXZ9LyTYtkMFw/0",
                nickName: 'you see'

            }

        ],
        delBtnWidth: 75,


        inputShowed: false,
        inputVal: ""
    },
    onLoad: function () {
        let that = this;
        that.load_inBlackListUsers();
    },
    load_inBlackListUsers: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: `https://collhome.com/apis/blacklists?wesecret=${wesecret}`,
            success: function (res) {
                // that.setData({
                //     users: res.data.data
                // })
            }
        })
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
        let user_id = e.currentTarget.dataset.userid;
        console.log("touchM:", e);
        console.log("M user_id:", user_id);
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
            let users = that.data.users;
            for (let user of users) {
                if (user.id == user_id) {
                    user.txtStyle = txtStyle
                }
            }
            that.setData({
                users: users,
            })
        }
    },
    touchE: function (e) {
        let user_id = e.currentTarget.dataset.userid;

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
            let users = that.data.users;
            for (let user of users) {
                if (user.id == user_id) {
                    user.txtStyle = txtStyle
                }
            }
            that.setData({
                users: users,
            })
        }
    },


    navigateToProfileShow: function (e) {
        let user_id = e.currentTarget.dataset.userid;
        wx.navigateTo({
            url: `../profileShow/profileShow?user_id=${user_id}`,
        })
    },
    removeUser: function (e) {
        console.log('eee', e);
        let that = this;
        let user_id = e.currentTarget.dataset.userid;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/apis/blacklists',
            method: 'POST',
            data: {
                wesecret: wesecret,
                objectUser_id: user_id,
                inBlacklists: 0
            },
            success: function (res) {
                that.load_inBlackListUsers();
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

});
