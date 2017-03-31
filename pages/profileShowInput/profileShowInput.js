import dataAPI from '../../utils/utils.js'

Page({
    data: {
        colleges: ["福州大学", "福建师范大学", "福建师大协和学院", "福建医科大学", "福建中医药大学", "福建农林大学", "福建工程学院", "闽江学院", "江夏学院", "福州教育学院", "华南女子学院", "福州职业技术学院", "平潭海洋大学", "福州大学至诚学院", "福州大学阳光学院", "福建农林大学金山学院 ", "福建农林大学东方学院", "福建警察学院", "福州外语外贸学院"],
        grades: ['2017级', '2016级', '2015级', '2014级', '2013级', '2017级研', '2016级研', '2015级研', '2014级研'],

        files: [],
        // showTopTips: false,
    },
    onLoad: function () {
        let that = this;

        let wesecret = wx.getStorageSync('wesecret');
        let userInfo = wx.getStorageSync('userInfo');
        that.setData({
            wesecret: wesecret,
            userInfo: userInfo
        })
    },

    onShow: function (e) {
        var that = this;

        if (wx.getStorageSync('hometown')) {
            var hometown = wx.getStorageSync('hometown');

            that.setData({
                hometown: hometown
            });

            wx.removeStorageSync('province');
            wx.removeStorageSync('city');
            wx.removeStorageSync('hometown');
        }
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
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
    },

    bindBirthdayChange: function (e) {
        this.setData({
            birthday: e.detail.value
        })
    },
    bindCollegeChange: function (e) {
        console.log('eee', e);
        this.setData({
            collegeIndex: e.detail.value
        })
    },
    bindGradeChange: function (e) {
        this.setData({
            gradeIndex: e.detail.value
        })
    },

    formSubmit: function (e) {
        console.log('e', e.detail.value)
        let that = this;
        let submitData = e.detail.value;
        if (that.data.hometown) {
            submitData.hometown = that.data.hometown;
        } else {
            submitData.hometown = that.data.userInfo.hometown;
        }
        if (!submitData.hometown) {
            submitData.hometown = '';
        };
        console.log("submitData",submitData);
        // return
        wx.uploadFile({
            url: 'https://collhome.com/api/users',
            filePath: that.data.files,
            name: 'file',
            formData: {
                'wesecret': that.data.wesecret,
                'userInfo': submitData,
            },
            success: function (res) {
                console.log('success.res', res);
                wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 1000
                });
                setTimeout(function () {
                    wx.navigateBack();
                }, 1000)
            },
            fail: function (res) {
                console.log('fail.res', res);
            },
            complete: function (res) {
                console.log('complete.res', res);
            }

        })
    },
    // showTopTips: function () {
    //     var that = this;
    //     this.setData({
    //         showTopTips: true
    //     });
    //     setTimeout(function () {
    //         that.setData({
    //             showTopTips: false
    //         });
    //     }, 3000);
    // }
});