// pages/manage/manage.js
Page({
    data: {},
    signOut: function () {
        wx.showActionSheet({
            itemList: ['退出登录'],
            itemColor: '#ff0000',
            success: function (res) {
                console.log(res.tapIndex)
                if (res.tapIndex == 0) {
                    wx.removeStorageSync('wesecret');
                    wx.setStorageSync('my_userInfo', {});
                    wx.setStorageSync('user_need_refresh', 1);

                    wx.navigateBack()
                }
            }
        })
    }
})