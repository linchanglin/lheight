function signIn() {
    let that = this;
    wx.showModal({
        title: '提示',
        content: '您还未登录呢，立即使用微信登录!',
        confirmText: '确定',
        success: function (res) {
            if (res.confirm) {
                console.log('用户点击确定')

                wx.login({
                    success: (res) => {
                        const code = res.code
                        if (code) {
                            wx.getUserInfo({
                                success: (res) => {
                                    console.log('res', res);
                                    console.log('code', code, 'encryptedData', res.encryptedData, 'iv', res.iv)
                                    wx.request({
                                        url: 'https://collhome.com/apis/register',
                                        method: 'POST',
                                        data: {
                                            code: code,
                                            encryptedData: res.encryptedData,
                                            iv: res.iv
                                        },
                                        success: function (res) {
                                            console.log('wesecret res', res);
                                            let wesecret = res.data;
                                            wx.setStorageSync('wesecret', wesecret);
                                            wx.request({
                                                url: 'https://collhome.com/apis/user?wesecret=' + wesecret,
                                                success: function (res) {
                                                    console.log('my_userInfo res', res)
                                                    let my_userInfo = res.data.data;
                                                    wx.setStorageSync('my_userInfo', my_userInfo);
                                                }
                                            })
                                        }
                                    })

                                }
                            })
                        } else {
                            console.log('获取用户登录态失败！' + res.errMsg)
                        }
                    }
                });
            }
        }
    })
}

module.exports = {
    signIn: signIn
}