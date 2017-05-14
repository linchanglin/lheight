// pages/loveInput/loveInput.js
Page({
  data: {
    files: [],
    content: "",
    location: {},
    visiable: 0,
    location_exist: 0,
    save_loading: false,


    colleges: ['上济北校区','济南校区'],
    collegeIndex: 0
  },
  onLoad: function () {
    let that = this;

    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      that.setData({
        wesecret: wesecret
      })
    }
  },
  onShow: function () {
    let that = this;
    let value = wx.getStorageSync('visiable');
    if (value) {
      that.setData({
        visiable: value
      });
      wx.removeStorageSync('visiable');
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
  bindCollegeChange: function (e) {
        this.setData({
            collegeIndex: e.detail.value
        })
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
    this.setData({
      content: e.detail.value
    })
  },
  saveLove: function () {
    let that = this;

    if (that.data.content.length > 0 || that.data.files.length > 0) {
      
      that.setData({
        save_loading: true
      })

      wx.request({
        url: 'https://collhome.com/shangongyuan/api/virtual/loves',
        data: {
          // 'wesecret': that.data.wesecret,
          'content': that.data.content,
          'location': that.data.location,
          'visiable': that.data.visiable,
          'user_id': parseInt(that.data.collegeIndex) + 1
        },
        method: 'POST',
        success: function (res) {
          console.log('res', res);
          let love_id = res.data.love_id;

          let successUp = 0; //成功个数
          let failUp = 0; //失败个数
          let length = that.data.files.length; //总共个数
          let i = 0; //第几个
          if (length > 0) {
            that.saveLoveImage(love_id, that.data.files, successUp, failUp, i, length);
          } else {
            that.switchTabToBoardWithSuccess();
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


    }
  },
  saveLoveImage: function (love_id, files, successUp, failUp, i, length) {
    let that = this;
    wx.uploadFile({
      url: 'https://collhome.com/shangongyuan/api/virtual/loves/images',
      filePath: that.data.files[i],
      name: 'file',
      formData: {
        wesecret: that.data.wesecret,
        post_id: love_id
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
          that.switchTabToBoardWithSuccess();
        }
        else {  //递归调用uploadDIY函数
          that.saveLoveImage(love_id, files, successUp, failUp, i, length);
        }
      }
    })
  },
  switchTabToBoardWithSuccess: function () {
    let that = this;
    that.setData({
      save_loading: false
    })
    wx.setStorageSync('board_loves_need_refresh', 1);
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    });
  }

})