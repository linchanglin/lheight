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
    data: {
        files: []
    },
    onLoad: function () {
        let that = this;

        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        console.log('my_userInfo', my_userInfo);
        let signature_show = my_userInfo.signature;
        let signature;
        if (signature_show.length > 10) {
            signature = signature_show.substring(0, 10) + '...'
        } else {
            signature = signature_show
        }
        that.setData({
            wesecret: wesecret,
            userInfo: my_userInfo,
            signature: signature
        })

    },
    onShow: function () {
        let that = this;
        let profile_need_refresh = wx.getStorageSync('profile_need_refresh')
        if (profile_need_refresh) {
            let my_userInfo = wx.getStorageSync('my_userInfo');
            that.setData({
                userInfo: my_userInfo,
            })
            wx.removeStorageSync('profile_need_refresh')
        }
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let add_files = res.tempFilePaths;
                let totalPictureLength = add_files.length + that.data.files.length;
                if (totalPictureLength > 9) {
                    that.openAlertPictureTooMany();
                } else {
                    if (add_files.length > 0) {
                        initQiniu();
                        let files = that.data.files;
                        let i = 0;
                        for (let filePath of add_files) {
                            // 交给七牛上传
                            qiniuUploader.upload(filePath, (res) => {
                                files.push(res.imageURL)
                                that.setData({
                                    files: files
                                })
                            }, (error) => {
                                console.error('error: ' + JSON.stringify(error));
                            }, (complete) => {
                                console.log('complete', complete)
                                i++;
                                if (i == add_files.length) {
                                    that.postSavePictures();
                                }
                            });
                        }
                    } else {
                        that.postSaveLove();
                    }
                }
            }
        })
    },
    postSavePictures: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: 'https://collhome.com/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                pictures: that.data.files
            },
            success: function (res) {
                common.get_my_userInfo(wesecret);
            }
        })
    },
    openAlertPictureTooMany: function () {
        wx.showModal({
            content: '照片最多只能上传9张哟!',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
        });
    },
    previewImage: function (e) {
        console.log('e.currentTarget.id', e.currentTarget.id);
        console.log('this.data.files', this.data.files);
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    deleteImage: function (e) {
        let that = this;
        let the_delete_image = e.currentTarget.dataset.image;
        let new_files = [];
        for (let value of that.data.files) {
            if (the_delete_image != value) {
                new_files.push(value)
            }
        }
        that.setData({
            files: new_files
        })
        that.deleteUserPicture(the_delete_image)
    },
    deleteUserPicture: function (picture) {
        let that = this;
        wx.request({
            url: 'https://collhome.com/apis/delete/user/picture',
            method: 'POST',
            data: {
                wesecret: that.data.wesecret,
                picture: picture
            },
            success: function (res) {
                common.get_my_userInfo(that.data.wesecret);
            }
        })
    },

    navigateToNicknameInput: function () {
        wx.navigateTo({
            url: '../nicknameInput/nicknameInput',
        })
    },
    navigateToGenderInput: function () {
        wx.navigateTo({
            url: '../genderInput/genderInput',
        })
    },
    navigateToCollegeInput: function () {
        wx.navigateTo({
            url: '../collegeInput/collegeInput',
        })
    },
    navigateToSignatureInput: function () {
        wx.navigateTo({
            url: '../signatureInput/signatureInput',
        })
    },
});