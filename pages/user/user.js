var app = getApp()

Page({
    data: {
        userInfo: {}
    },
    onLoad: function () {
        wx.login({
            success: (res) => {
                const code = res.code
                if (code) {
                    wx.getUserInfo({
                        success: (res) => {
                            console.log('code',code, 'encryptedData',res.encryptedData, 'iv',res.iv)
                            return
                            api.post('signIn', {
                                code: code,
                                encryptedData: res.encryptedData,
                                iv: res.iv
                            }, (data) => {
                                console.log(data)
                                this.setData({
                                    avatar: data.people.avatar,
                                    name: data.people.name,
                                    authed: true
                                })
                                try {
                                    wx.setStorageSync('token', data.token)
                                    wx.setStorageSync('people', data.people)
                                } catch (e) {
                                    console.log(e)
                                }
                                wx.showToast({
                                    title: '登录成功',
                                    icon: 'success',
                                    duration: 2000
                                })
                            })
                        }
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    }
});