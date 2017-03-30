import dataAPI from '../../utils/utils.js'

Page({
    data: {
        user: {},
        files: [],


        showTopTips: false,

        colleges: ["福州大学", "福建师范大学", "福建师大协和学院", "福建医科大学", "福建中医药大学", "福建农林大学", "福建工程学院", "闽江学院", "江夏学院", "福州教育学院", "华南女子学院", "福州职业技术学院", "平潭海洋大学", "福州大学至诚学院", "福州大学阳光学院", "福建农林大学金山学院 ", "福建农林大学东方学院", "福建警察学院", "福州外语外贸学院"],
        grades: ['2017级', '2016级', '2015级', '2014级', '2013级', '2017级研', '2016级研', '2015级研', '2014级研'],

        isAgree: false,






        provinceList: dataAPI.provinceList,
        provinceShowStatus: true,
        cityShowStatus: false,
        districtShowStatus: false,
        cityList: [],
        districtList: []
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
    onShow: function (e) {
        var that = this;

        if (wx.getStorageSync('hometown')) {
            var hometown = wx.getStorageSync('hometown');
            console.log('hometown111111', hometown);
            that.setData({
                user: { "hometown": hometown }
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
    previewImage: function (e) {
        console.log('e.currentTarget.id', e.currentTarget.id);
        console.log('this.data.files', this.data.files);
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    saveProfileShow: function () {
        let that = this;
        
        console.log('that.data.files');
        console.log('that.data.files',that.data.files);
        wx.uploadFile({
          url: 'https://collhome.com/api/images/upload',
          filePath: that.data.files[0],
          name:'file',
          formData: {
              'wesecret': 'eyJpdiI6InFmbFBwSFdRQjVYcHZ3WXhBZ21iUmc9PSIsInZhbHVlIjoiS1JFUzdkNGpEcVJ3Y3lWNlRMNTBnaGJRTHJtUFwvSkdEc0lyQUlZdHQ4c3FaMkVyNU9kUHA2aWwxaXJvNkl5VnEiLCJtYWMiOiIzMGRhOTY4MjcwYmMyNTYwZmY1OTY4MjZiODBlM2ZkMDkyMDlhNWE1YTE0NjM1ZTEzOTg2ZmRhNWVhOGI3NDY1In0=',
              'content': 'content',
          },
          success: function(res){
            console.log('res',res);
          },
          fail: function(res) {
            console.log('fail.res',res);
          },
          complete: function (res) {
              console.log('complete.res',res);
          } 
          
        })
    },
    showTopTips: function () {
        var that = this;
        this.setData({
            showTopTips: true
        });
        setTimeout(function () {
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems: radioItems
        });
    },
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);

        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;

            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (checkboxItems[i].value == values[j]) {
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems
        });
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    bindCountryCodeChange: function (e) {
        console.log('picker country code 发生选择改变，携带值为', e.detail.value);

        this.setData({
            countryCodeIndex: e.detail.value
        })
    },
    bindCountryChange: function (e) {
        console.log('picker country 发生选择改变，携带值为', e.detail.value);

        this.setData({
            countryIndex: e.detail.value
        })
    },
    bindAccountChange: function (e) {
        console.log('picker account 发生选择改变，携带值为', e.detail.value);

        this.setData({
            accountIndex: e.detail.value
        })
    },
    bindAgreeChange: function (e) {
        this.setData({
            isAgree: !!e.detail.value.length
        });
    },




    setProvice: function (e) {
        var index = parseInt(e.currentTarget.dataset.index) ? parseInt(e.currentTarget.dataset.index) : 0;
        console.log('选择省', index, this.data.provinceList[index]);
        wx.setStorageSync('addressProvice', this.data.provinceList[index])
        this.setData({
            provinceShowStatus: false,
            cityShowStatus: true,
            districtShowStatus: false,
            cityList: this.data.provinceList[index].children
        });
    },
    setCity: function (e) {
        var index = parseInt(e.currentTarget.dataset.index) ? parseInt(e.currentTarget.dataset.index) : 0;
        console.log('选择市', index, this.data.cityList[index]);
        wx.setStorageSync('addressCity', this.data.cityList[index])
        this.setData({
            provinceShowStatus: false,
            cityShowStatus: false,
            districtShowStatus: true,
            districtList: this.data.cityList[index].children
        });
    },
    setDistrict: function (e) {
        var index = parseInt(e.currentTarget.dataset.index) ? parseInt(e.currentTarget.dataset.index) : 0;
        console.log('选择区', index, this.data.districtList[index]);
        wx.setStorageSync('addressDistrict', this.data.districtList[index])
        var addressDetail = {};
        console.log('修改前缓存地址省市区', addressDetail);
        addressDetail.province = wx.getStorageSync('addressProvice').label;
        addressDetail.city = wx.getStorageSync('addressCity').label;
        addressDetail.district = wx.getStorageSync('addressDistrict').label;
        console.log('修改后缓存地址省市区', addressDetail);
        wx.setStorageSync('address', addressDetail);
        this.setData({
            provinceShowStatus: false,
            cityShowStatus: false,
            districtShowStatus: true
        });
        wx.showToast({
            title: addressDetail.province + addressDetail.city + addressDetail.district,
            icon: 'success',
            duration: 3000
        })
    }
});