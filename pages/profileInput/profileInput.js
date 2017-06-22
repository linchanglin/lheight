import common from '../../utils/common.js';
import qiniuUploader from '../../utils/qiniuUploader.js';

Page({
    data: {
        files: []
    },
    onLoad: function () {
        let that = this;

        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        console.log('my_userInfo onLoad', my_userInfo);
        let signature_show = my_userInfo.signature;
        let signature;
        if (signature_show.length > 10) {
            signature = signature_show.substring(0, 10) + '...'
        } else {
            signature = signature_show
        }
        let pictureOnWall;
        if (my_userInfo.pictureOnWall == 1) {
            pictureOnWall = true
        } else {
            pictureOnWall = false
        }
        that.setData({
            wesecret: wesecret,
            userInfo: my_userInfo,
            signature: signature,
            files: my_userInfo.pictures,
            pictureOnWall: pictureOnWall
        })

    },
    onShow: function () {
        let that = this;
        let profile_need_refresh = wx.getStorageSync('profile_need_refresh')
        if (profile_need_refresh) {
            let my_userInfo = wx.getStorageSync('my_userInfo');
            console.log('my_userInfo1111', my_userInfo);
            let signature_show = my_userInfo.signature;
            let signature;
            if (signature_show.length > 10) {
                signature = signature_show.substring(0, 10) + '...'
            } else {
                signature = signature_show
            }
            let pictureOnWall;
            if (my_userInfo.pictureOnWall == 1) {
                pictureOnWall = true
            } else {
                pictureOnWall = false
            }
            that.setData({
                userInfo: my_userInfo,
                signature: signature,
                files: my_userInfo.pictures,
                pictureOnWall: pictureOnWall
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

                        qiniuUploader.getUptoken().then((uptoken) => {
                            let files = that.data.files;
                            let i = 0;
                            for (let filePath of add_files) {
                                qiniuUploader.upload(uptoken, filePath, (res) => {
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
                        })

                    }
                }
            }
        })
    },
    postSavePictures: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        wx.request({
            url: 'https://collhome.com/jiangxi-jingdezhen/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                userInfo: {
                    pictures: that.data.files
                }
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
        let wesecret = that.data.wesecret;
        wx.request({
            url: 'https://collhome.com/jiangxi-jingdezhen/apis/delete/user/picture',
            method: 'POST',
            data: {
                wesecret: wesecret,
                userInfo: {
                    remain_pictures: that.data.files,
                    the_delete_picture: picture
                }
            },
            success: function (res) {
                common.get_my_userInfo(wesecret);
            }
        })
    },
    showPictureOnWall: function (e) {
        console.log("showPictureOnWall e", e);
        let that = this;
        let value = e.detail.value;
        if (value) {
            that.setData({
                pictureOnWall: 1
            })
        } else {
            that.setData({
                pictureOnWall: 0
            })
        }
        that.postSavePictureOnWall();
    },
    postSavePictureOnWall: function () {
        let that = this;
        let wesecret = that.data.wesecret;
        wx.request({
            url: 'https://collhome.com/jiangxi-jingdezhen/apis/users',
            method: 'POST',
            data: {
                wesecret: wesecret,
                userInfo: {
                    pictureOnWall: that.data.pictureOnWall
                }
            },
            success: function (res) {
                common.get_my_userInfo(wesecret);
            }
        })
    },
    navigateToAvatarUrlInput: function () {
        wx.navigateTo({
            url: '../avatarUrlInput/avatarUrlInput',
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
    navigateToProfileDetailsInput: function () {
        wx.navigateTo({
            url: '../profileDetailsInput/profileDetailsInput',
        })
    }
});