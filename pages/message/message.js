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
        let index = e.currentTarget.dataset.index;
        console.log("touchM:", e);
        console.log("M index:", index);
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
                txtStyle = "left:0px";
            } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
                txtStyle = "left:-" + disX + "px";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度
                    txtStyle = "left:-" + delBtnWidth + "px";
                }
            }
            txtStyle = txtStyle + ";transition: left 0.3s;"
            let messages = that.data.messages;
            for (let message of messages) {
                if (message.id == index) {
                    message.txtStyle = txtStyle
                }
            }
            that.setData({
                messages: messages
            })

            // that.setData({
            //     txtStyle: txtStyle,
            //     the_selected_message_id: index
            // })
            // //获取手指触摸的是哪一个item
            // var index = e.currentTarget.dataset.index;
            // var list = that.data.addressList;
            // //将拼接好的样式设置到当前item中
            // list[index].txtStyle = txtStyle;
            // //更新列表的状态
            // this.setData({
            //     addressList: list
            // });
        }
    },
    touchE: function (e) {
        let index = e.currentTarget.dataset.index;
        
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
            // that.setData({
                txtStyle = txtStyle + ";transition: left 0.3s;"
            // })
            let messages = that.data.messages;
            for (let message of messages) {
                if (message.id == index) {
                    message.txtStyle = txtStyle
                }
            }
            that.setData({
                messages: messages
            })
            // //获取手指触摸的是哪一项
            // var index = e.currentTarget.dataset.index;
            // var list = that.data.addressList;
            // list[index].txtStyle = txtStyle;
            // //更新列表的状态
            // that.setData({
            //     addressList: list
            // });
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



//app.js
// App({
//     data: {
//         deviceInfo: {}
//     },
//     onLaunch: function () {
//         this.data.deviceInfo = wx.getSystemInfoSync();
//         console.log(this.data.deviceInfo);
//     }
// })
// var app = getApp()
// Page({
//     data: {
//         msgList: [],
//         height: 0,
//         scrollY: true
//     },
//     swipeCheckX: 35, //激活检测滑动的阈值
//     swipeCheckState: 0, //0未激活 1激活
//     maxMoveLeft: 185, //消息列表项最大左滑距离
//     correctMoveLeft: 175, //显示菜单时的左滑距离
//     thresholdMoveLeft: 75,//左滑阈值，超过则显示菜单
//     lastShowMsgId: '', //记录上次显示菜单的消息id
//     moveX: 0,  //记录平移距离
//     showState: 0, //0 未显示菜单 1显示菜单
//     touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
//     swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动
//     onLoad: function () {
//         this.pixelRatio = app.data.deviceInfo.pixelRatio;
//         var windowHeight = app.data.deviceInfo.windowHeight;
//         var height = windowHeight;
//         for (var i = 0; i < 30; i++) {
//             var msg = {};
//             msg.userName = '' + '用户' + i + 1;
//             msg.msgText = '您有新的消息'
//             msg.id = 'id-' + i + 1;
//             msg.headerImg = '../../res/img/head.png';
//             this.data.msgList.push(msg);
//         }
//         this.setData({ msgList: this.data.msgList, height: height });
//     },

//     ontouchstart: function (e) {
//         if (this.showState === 1) {
//             this.touchStartState = 1;
//             this.showState = 0;
//             this.moveX = 0;
//             this.translateXMsgItem(this.lastShowMsgId, 0, 200);
//             this.lastShowMsgId = "";
//             return;
//         }
//         this.firstTouchX = e.touches[0].clientX;
//         this.firstTouchY = e.touches[0].clientY;
//         if (this.firstTouchX > this.swipeCheckX) {
//             this.swipeCheckState = 1;
//         }
//         this.lastMoveTime = e.timeStamp;
//     },

//     ontouchmove: function (e) {
//         if (this.swipeCheckState === 0) {
//             return;
//         }
//         //当开始触摸时有菜单显示时，不处理滑动操作
//         if (this.touchStartState === 1) {
//             return;
//         }
//         var moveX = e.touches[0].clientX - this.firstTouchX;
//         var moveY = e.touches[0].clientY - this.firstTouchY;
//         //已触发垂直滑动，由scroll-view处理滑动操作
//         if (this.swipeDirection === 2) {
//             return;
//         }
//         //未触发滑动方向
//         if (this.swipeDirection === 0) {
//             console.log(Math.abs(moveY));
//             //触发垂直操作
//             if (Math.abs(moveY) > 4) {
//                 this.swipeDirection = 2;

//                 return;
//             }
//             //触发水平操作
//             if (Math.abs(moveX) > 4) {
//                 this.swipeDirection = 1;
//                 this.setData({ scrollY: false });
//             }
//             else {
//                 return;
//             }

//         }
//         //禁用垂直滚动
//         // if (this.data.scrollY) {
//         //   this.setData({scrollY:false});
//         // }

//         this.lastMoveTime = e.timeStamp;
//         //处理边界情况
//         if (moveX > 0) {
//             moveX = 0;
//         }
//         //检测最大左滑距离
//         if (moveX < -this.maxMoveLeft) {
//             moveX = -this.maxMoveLeft;
//         }
//         this.moveX = moveX;
//         this.translateXMsgItem(e.currentTarget.id, moveX, 0);
//     },
//     ontouchend: function (e) {
//         this.swipeCheckState = 0;
//         var swipeDirection = this.swipeDirection;
//         this.swipeDirection = 0;
//         if (this.touchStartState === 1) {
//             this.touchStartState = 0;
//             this.setData({ scrollY: true });
//             return;
//         }
//         //垂直滚动，忽略
//         if (swipeDirection !== 1) {
//             return;
//         }
//         if (this.moveX === 0) {
//             this.showState = 0;
//             //不显示菜单状态下,激活垂直滚动
//             this.setData({ scrollY: true });
//             return;
//         }
//         if (this.moveX === this.correctMoveLeft) {
//             this.showState = 1;
//             this.lastShowMsgId = e.currentTarget.id;
//             return;
//         }
//         if (this.moveX < -this.thresholdMoveLeft) {
//             this.moveX = -this.correctMoveLeft;
//             this.showState = 1;
//             this.lastShowMsgId = e.currentTarget.id;
//         }
//         else {
//             this.moveX = 0;
//             this.showState = 0;
//             //不显示菜单,激活垂直滚动
//             this.setData({ scrollY: true });
//         }
//         this.translateXMsgItem(e.currentTarget.id, this.moveX, 500);
//         //this.translateXMsgItem(e.currentTarget.id, 0, 0);
//     },
//     onDeleteMsgTap: function (e) {
//         this.deleteMsgItem(e);
//     },
//     onDeleteMsgLongtap: function (e) {
//         console.log(e);
//     },
//     onMarkMsgTap: function (e) {
//         console.log(e);
//     },
//     onMarkMsgLongtap: function (e) {
//         console.log(e);
//     },
//     getItemIndex: function (id) {
//         var msgList = this.data.msgList;
//         for (var i = 0; i < msgList.length; i++) {
//             if (msgList[i].id === id) {
//                 return i;
//             }
//         }
//         return -1;
//     },
//     deleteMsgItem: function (e) {
//         var animation = wx.createAnimation({ duration: 200 });
//         animation.height(0).opacity(0).step();
//         this.animationMsgWrapItem(e.currentTarget.id, animation);
//         var s = this;
//         setTimeout(function () {
//             var index = s.getItemIndex(e.currentTarget.id);
//             s.data.msgList.splice(index, 1);
//             s.setData({ msgList: s.data.msgList });
//         }, 200);
//         this.showState = 0;
//         this.setData({ scrollY: true });
//     },
//     translateXMsgItem: function (id, x, duration) {
//         var animation = wx.createAnimation({ duration: duration });
//         animation.translateX(x).step();
//         this.animationMsgItem(id, animation);
//     },
//     animationMsgItem: function (id, animation) {
//         var index = this.getItemIndex(id);
//         var param = {};
//         var indexString = 'msgList[' + index + '].animation';
//         param[indexString] = animation.export();
//         this.setData(param);
//     },
//     animationMsgWrapItem: function (id, animation) {
//         var index = this.getItemIndex(id);
//         var param = {};
//         var indexString = 'msgList[' + index + '].wrapAnimation';
//         param[indexString] = animation.export();
//         this.setData(param);
//     },
// })