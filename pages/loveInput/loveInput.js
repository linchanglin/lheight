// pages/loveInput/loveInput.js
Page({
  data: {
    files: [],
    content: "",
    location: {},
    visiable: 0,
    location_exist: 0

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
      let wesecret = wx.getStorageSync('wesecret');
      wx.uploadFile({
        url: 'https://collhome.com/api/loves',
        filePath: that.data.files,
        name: 'file',
        formData: {
          'wesecret': wesecret,
          'content': that.data.content,
          'location': that.data.location,
          'visiable': that.data.visiable
        },
        success: function (res) {
          console.log('success.res', res);
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          });
          setTimeout(function(){
            wx.navigateBack();
          },1000)
        },
        fail: function (res) {
          console.log('fail.res', res);
        },
        complete: function (res) {
          console.log('complete.res', res);
        }

      })
    }
  }

})