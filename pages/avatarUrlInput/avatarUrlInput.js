import common from '../../utils/common.js';
import qiniuUploader from '../../utils/qiniuUploader.js';

// 初始化七牛相关参数
function initQiniu() {
    var options = {
        region: 'SCN', // 华南区
        uptokenURL: 'https://collhome.com/apis/uptoken',
        domain: 'http://cdn.collhome.com'
    };
    qiniuUploader.init(options);
}


Page({
    data: {},
    onLoad: function (options) {
        let that = this;
        let my_userInfo = wx.getStorageSync('my_userInfo');
        that.setData({
            avatarUrl: my_userInfo.avatarUrl
        })
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let add_files = res.tempFilePaths;
                if (add_files.length > 1) {
                    that.openAlertPictureTooMany();
                } else {
                    if (add_files.length > 0) {
                        initQiniu();
                        let filePath = add_files[0];
                        qiniuUploader.upload(filePath, (res) => {
                            that.setData({
                                avatarUrl: res.imageURL
                            })
                            that.postSaveAvatarUrl();
                        }, (error) => {
                            console.error('error: ' + JSON.stringify(error));
                        }, (complete) => {

                        });
                    }
                }
            }
        })
    },
    openAlertPictureTooMany: function () {
        wx.showModal({
            content: '头像只能上传一张照片哟!',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
        });
    },
    postSaveAvatarUrl: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                avatarUrl: that.data.avatarUrl
            },
            success: function (res) {
                wx.setStorageSync('profile_need_refresh', 1);
                common.get_my_userInfo(wesecret);
            }
        })
    },
})