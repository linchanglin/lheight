import common from '../../utils/common.js';
import qiniuUploader from '../../utils/qiniuUploader.js';

Page({
    data: {
        files: [],
        region: [],
        save_loading: false,
    },
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        let my_userInfo = wx.getStorageSync('my_userInfo');
        console.log('my_userInfo', my_userInfo);
        let region;
        let my_userInfo_region = my_userInfo.hometown;
        if (my_userInfo_region.length > 0) {
            region = my_userInfo_region.split(" ");
        } else {
            region = [];
        }

        that.setData({
            wesecret: wesecret,
            userInfo: my_userInfo,
            birthdayIndex: my_userInfo.birthday,
            files: my_userInfo.pictures,
            region: region
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
            url: 'https://collhome.com/life/apis/users',
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
        let that = this;
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: that.data.files // 需要预览的图片http链接列表
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
            url: 'https://collhome.com/life/apis/delete/user/picture',
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
    bindBirthdayChange: function (e) {
        this.setData({
            birthdayIndex: e.detail.value
        })
    },
    bindRegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },
    saveFormid: function (form_id) {
      let that = this;
      let wesecret = wx.getStorageSync('wesecret');
      if (wesecret) {
        let data = {
          wesecret: wesecret,
          form_id, form_id
        }
        wx.request({
          url: 'https://collhome.com/life/apis/templateMessages',
          method: 'POST',
          data: data,
          success: function (res) {
            console.log('saveFormid res', res);
          }
        })
      }
    },
    formSubmit: function (e) {
        let that = this;
        let form_id = e.detail.formId;
        that.saveFormid(form_id);

        let submitData = e.detail.value;
        let region = that.data.region;
        submitData.birthday = that.data.birthdayIndex;
        submitData.hometown = region[0] + ' ' + region[1] + ' ' + region[2];

        console.log("submitData", submitData);

        that.setData({
            save_loading: true
        })

        wx.request({
            url: 'https://collhome.com/life/apis/users',
            data: {
                'wesecret': that.data.wesecret,
                'userInfo': submitData,
            },
            method: 'POST',
            success: function (res) {
                common.get_my_userInfo(that.data.wesecret).then((user_id) => {
                    that.navigateBackWithSuccess();
                });
            }
        })
    },
    navigateBackWithSuccess: function () {
        let that = this;
        that.setData({
            save_loading: false
        })
        wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
        });
        setTimeout(function () {
            wx.navigateBack();
        }, 1000)
    }
});