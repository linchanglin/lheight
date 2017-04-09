import dataAPI from '../../utils/utils.js'

Page({
    data: {
        colleges: ["福州大学", "福建师范大学", "福建师大协和学院", "福建医科大学", "福建中医药大学", "福建农林大学", "福建工程学院", "闽江学院", "江夏学院", "福州教育学院", "华南女子学院", "福州职业技术学院", "平潭海洋大学", "福州大学至诚学院", "福州大学阳光学院", "福建农林大学金山学院 ", "福建农林大学东方学院", "福建警察学院", "福州外语外贸学院"],
        grades: ['2017级', '2016级', '2015级', '2014级', '2013级', '2017级研', '2016级研', '2015级研', '2014级研'],
        genders: ['男', '女'],

        files: [],
        // showTopTips: false,

    },
    onLoad: function () {
        let that = this;

        let wesecret = wx.getStorageSync('wesecret');
        that.setData({
            wesecret: wesecret,
        })

        wx.request({
            url: 'https://collhome.com/api/user?wesecret=' + wesecret,

            success: function (res) {
                console.log(res.data)
                let userInfo = res.data.data;
                that.setData({
                    userInfo: userInfo
                })
                // that.setData({
                //     files: userInfo.pictures
                // })
                that.setData({
                    genderIndex: userInfo.gender
                })
                that.setData({
                    birthdayIndex: userInfo.birthday
                })
                that.setData({
                    collegeIndex: userInfo.college
                })
                that.setData({
                    gradeIndex: userInfo.grade
                })
            }
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
    bindGenderChange: function (e) {
        console.log('bindGenderChange', e)
        this.setData({
            genderIndex: e.detail.value
        })
    },
    bindBirthdayChange: function (e) {
        this.setData({
            birthdayIndex: e.detail.value
        })
    },
    bindCollegeChange: function (e) {
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

        if (that.data.genderIndex == 0) {
            submitData.gender = 1
        } else if (that.data.genderIndex == 1) {
            submitData.gender = 2
        } else {
            submitData.gender = 0
        }

        submitData.birthday = that.data.birthdayIndex;
        submitData.college = that.data.collegeIndex;
        submitData.grade = that.data.gradeIndex;

        if (that.data.hometown) {
            submitData.hometown = that.data.hometown;
        } else {
            if (that.data.userInfo) {
                submitData.hometown = that.data.userInfo.hometown;
            } else {
                submitData.hometown = '';
            }
        }

        console.log("submitData", submitData);
        console.log("that.data.files", that.data.files);

        wx.request({
            url: 'https://collhome.com/api/users',
            data: {
                'wesecret': that.data.wesecret,
                'userInfo': submitData,
            },
            method: 'POST',
            success: function (res) {
                console.log('res', res);

                let successUp = 0; //成功个数
                let failUp = 0; //失败个数
                let length = that.data.files.length; //总共个数
                let i = 0; //第几个
                if (length > 0) {
                    that.saveUserPicture(that.data.files, successUp, failUp, i, length);
                }
            },
            fail: function (res) {
                console.log('fail res', res);
                // fail
            },
            complete: function (res) {
                // complete
            }
        })
    },
    saveUserPicture: function (files, successUp, failUp, i, length) {
        let that = this;
        wx.uploadFile({
            url: 'https://collhome.com/api/users/pictures',
            filePath: that.data.files[i],
            name: 'file',
            formData: {
                wesecret: that.data.wesecret,
            },
            success: function (res) {
                console.log('success res', res);
                successUp++;
            },
            fail: function (res) {
                console.log('fail res', res);
                failUp++;
            },
            complete: function (res) {
                i++;
                if (i == length) {
                    console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 1000
                    });
                    setTimeout(function () {
                        wx.navigateBack();
                    }, 1000)
                }
                else {  //递归调用uploadDIY函数
                    that.saveUserPicture(files, successUp, failUp, i, length);
                }
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