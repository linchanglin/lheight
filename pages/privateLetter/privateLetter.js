var app = getApp()
Page({
    data: {
        messageList: [],
        height: 0,
        scrollY: false
    },
    maxMoveLeft: 185, //消息列表项最大左滑距离
    correctMoveLeft: 175, //显示菜单时的左滑距离
    thresholdMoveLeft: 75,//左滑阈值，超过则显示菜单
    messageList: [],
    messageMap: {},
    lastShowMsgId: '', //记录上次显示菜单的消息id
    moveX: 0,  //记录平移距离
    showState: 0, //0 未显示菜单 1显示菜单
    touchStartState: 0, // 开始触摸时的状态 0 未显示菜单 1 显示菜单
    swipeDirection: 0, //是否触发水平滑动 0:未触发 1:触发水平滑动 2:触发垂直滑动
    onLoad: function () {
        this.pixelRatio = app.data.deviceInfo.pixelRatio;
        var windowHeight = app.data.deviceInfo.windowHeight;
        var height = windowHeight * app.data.deviceInfo.pixelRatio;
        for (var i = 0; i < 5; i++) {
            var msg = {};
            msg.userName = '' + '用户' + i + 1;
            msg.msgText = '您有新的消息'
            msg.id = 'id-' + i + 1;
            msg.headerImg = '../images/m1.jpg';
            this.messageList.push(msg);
            var itemWrap = { item: msg, index: i };
            this.messageMap[msg.id] = itemWrap;
        }
        this.setData({ messageList: this.messageList, height: height });
        this.setData({ scrollY: false });
    },

    ontouchstart: function (e) {
        console.log(this.showState);
        if (this.showState === 1) {
            this.touchStartState = 1;
            this.showState = 0;
            this.moveX = 0;
            this.translateXMsgItem(this.lastShowMsgId, 0, 200);
            this.lastShowMsgId = "";
            return;
        }
        this.firstTouchX = e.touches[0].clientX;
        this.firstTouchY = e.touches[0].clientY;
    },

    ontouchmove: function (e) {
        //当开始触摸时有菜单显示时，不处理滑动操作
        if (this.touchStartState === 1) {
            return;
        }
        var moveX = e.touches[0].clientX - this.firstTouchX;
        var moveY = e.touches[0].clientY - this.firstTouchY;
        //已触发垂直滑动，由scroll-view处理滑动操作
        if (this.swipeDirection === 2) {
            return;
        }
        //未触发滑动方向
        if (this.swipeDirection === 0) {
            //触发垂直操作
            if (Math.abs(moveX) < Math.abs(moveY)) {
                this.swipeDirection = 2;
                return;
            }
            //触发水平操作
            this.swipeDirection = 1;
        }
        //禁用垂直滚动
        if (this.data.scrollY) {
            this.setData({ scrollY: false });
        }
        //处理边界情况
        if (moveX > 0) {
            moveX = 0;
        }
        //检测最大左滑距离
        if (moveX < -this.maxMoveLeft) {
            moveX = -this.maxMoveLeft;
        }
        this.moveX = moveX;
        this.translateXMsgItem(e.currentTarget.id, moveX, 0);
    },
    ontouchend: function (e) {
        var swipeDirection = this.swipeDirection;
        this.swipeDirection = 0;
        if (this.touchStartState === 1) {
            this.touchStartState = 0;
            this.setData({ scrollY: true });
            return;
        }
        //垂直滚动，忽略
        if (swipeDirection !== 1) {
            return;
        }
        if (this.moveX === 0) {
            this.showState = 0;
            //不显示菜单状态下,激活垂直滚动
            this.setData({ scrollY: true });
            return;
        }
        if (this.moveX === this.correctMoveLeft) {
            this.showState = 1;
            this.lastShowMsgId = e.currentTarget.id;
            return;
        }
        if (this.moveX < -this.thresholdMoveLeft) {
            this.moveX = -this.correctMoveLeft;
            this.showState = 1;
            this.lastShowMsgId = e.currentTarget.id;
        }
        else {
            this.moveX = 0;
            this.showState = 0;
            //不显示菜单,激活垂直滚动
            this.setData({ scrollY: true });
        }
        this.translateXMsgItem(e.currentTarget.id, this.moveX, 200);
    },
    onDeleteMsgTap: function (e) {
        console.log(e);
    },
    onMarkMsgTap: function (e) {
        console.log(e);
    },
    translateXMsgItem: function (id, x, duration) {
        var itemWrap = this.messageMap[id];
        var animation = wx.createAnimation({ duration: duration });
        animation.translateX(x).step();
        var index = itemWrap.index;
        var param = {};
        var indexString = 'messageList[' + index + '].animation';
        param[indexString] = animation.export();
        this.setData(param);
    }
})
