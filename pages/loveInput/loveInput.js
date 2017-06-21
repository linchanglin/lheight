import common from '../../utils/common.js';
import qiniuUploader from '../../utils/qiniuUploader.js';

Page({
    data: {
        files: [],
        content: "",
        images: [],
        videoUrl_exist: 0,
        video_url: '',
        location_exist: 0,
        location: {},
        visiable: 0,
        anonymous: 0,

        save_loading: 0,
    },
    onLoad: function () {
        let that = this;
        let wesecret = wx.getStorageSync('wesecret');
        wx.request({
            url: `https://collhome.com/beijing/apis/user?wesecret=${wesecret}`,
            success: function (res) {
                that.setData({
                    wesecret: wesecret,
                    my_userInfo: res.data.data
                })
            }
        })
    },
    onShow: function () {
        let that = this;
        // let visiable = wx.getStorageSync('visiable');
        // if (visiable) {
        //     that.setData({
        //         visiable: visiable
        //     });
        //     wx.removeStorageSync('visiable');
        // }
        let video_url = wx.getStorageSync('video_url');
        if (video_url) {
            if (video_url == 'setnull') {
                that.setData({
                    videoUrl_exist: 0,
                    video_url: ''
                });
            } else {
                that.setData({
                    videoUrl_exist: 1,
                    video_url: video_url
                });
            }
            wx.removeStorageSync('video_url');
            that.set_loading_status();
        }
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let totalPictureLength = res.tempFilePaths.length + that.data.files.length;
                if (totalPictureLength > 9) {
                    that.openAlertPictureTooMany();
                    return;
                }
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });

                that.set_loading_status();
            }
        })
    },
    set_loading_status: function () {
        let that = this;
        if (that.data.content.length > 0 || that.data.files.length > 0 || that.data.video_url.length > 0) {
            that.setData({
                save_loading: 1
            })
        } else {
            that.setData({
                save_loading: 0
            })
        }
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
        that.set_loading_status();
    },
    chooseLocation: function () {
        let that = this;
        wx.chooseLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                console.log('ressssttttttttttt', res);
                that.setData({
                    location_exist: 1,
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude,
                        name: res.name,
                        address: res.address
                    }
                })
            }
        })
    },
    bindContentInput: function (e) {
        console.log('bindContentInput content', e.detail.value)
        let that = this;
        that.setData({
            content: e.detail.value
        })

        that.set_loading_status();
    },
    anonymousSwitchChange: function (e) {
        console.log("anonymousSwitchChange e", e);
        let that = this;
        let value = e.detail.value;
        if (value) {
            that.setData({
                anonymous: 1
            })
        } else {
            that.setData({
                anonymous: 0
            })
        }
    },
    navigateToVideoUrlInput: function () {
        let that = this;
        let url;
        let video_url = that.data.video_url;
        if (video_url) {
            url = `../videoUrlInput/videoUrlInput?video_url=${video_url}`
        } else {
            url = "../videoUrlInput/videoUrlInput";
        }
        wx.navigateTo({
            url: url,
        })
    },
    // navigateToVisiableInput: function () {
    //     let that = this;
    //     wx.navigateTo({
    //         url: `../visiableInput/visiableInput?visiable=${that.data.visiable}`
    //     })
    // },
    saveLove: function () {
        let that = this;
        if (that.data.my_userInfo.available == 0) {
            that.showNoAvailableModal();
        } else {
            if (that.data.my_userInfo.college == '') {
                that.showNoCollegeModal();
            } else {

                let content = that.data.content;
                let files = that.data.files;
                let images = that.data.images;
                let video_url = that.data.video_url;
                if (content.length > 0 || files.length > 0 || video_url.length > 0) {
                    that.setData({
                        save_loading: 2
                    })
                    if (video_url.length > 0) {
                        that.setData({
                            images: []
                        })
                        that.postSaveLove();
                    } else {
                        if (files.length > 0) {
                            qiniuUploader.getUptoken().then((uptoken) => {
                                let i = 0;
                                for (let filePath of files) {
                                    qiniuUploader.upload(uptoken, filePath, (res) => {
                                        images.push(res.imageURL)
                                        that.setData({
                                            images: images
                                        })
                                    }, (error) => {
                                        console.error('error: ' + JSON.stringify(error));
                                    }, (complete) => {
                                        console.log('complete', complete)
                                        i++;
                                        if (i == files.length) {
                                            that.postSaveLove();
                                        }
                                    });
                                }
                            })
                        } else {
                            that.postSaveLove();
                        }
                    }
                }
            }
        }
    },
    postSaveLove: function () {
        let that = this;
        let data = {
            'wesecret': that.data.wesecret,
            'content': that.data.content,
            'images': that.data.images,
            'video_url': that.data.video_url,
            'location': that.data.location,
            'visiable': that.data.visiable,
            'anonymous': that.data.anonymous
        };
        console.log("postSaveLove data", data);
        wx.request({
            url: 'https://collhome.com/beijing/apis/loves',
            method: 'POST',
            data: data,
            success: function (res) {
                that.switchTabToBoardWithSuccess();
            }
        })
    },
    showNoAvailableModal: function () {
        let that = this;
        let disabled_reason = that.data.my_userInfo.disabled_reason;
        wx.showModal({
            content: `您被禁止发表表白，原因是: ${disabled_reason} 请去 我 -> 我的管理 -> 客服，联系客服解禁，或其他方式联系客服解禁！给您造成不便，谢谢您的谅解！`,
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    showNoCollegeModal: function () {
        let that = this;
        wx.showModal({
            title: '未知学校',
            content: '发表表白需要知道您的学校呢，请去 我 -> 个人信息 -> 学校，选择您的学校！',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    switchTabToBoardWithSuccess: function () {
        let that = this;
        that.setData({
            save_loading: 1
        })
        wx.setStorageSync('board_loves_need_refresh_create_love', 1);
        wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
        });
        setTimeout(function () {
            wx.switchTab({
                url: '/pages/board/board'
            })
        }, 1000)
    }

})