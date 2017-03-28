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
  bindContentInput: function(e) {
     this.setData({
      content: e.detail.value
    })
  },
  saveLove: function () {
    let that = this;
    wx.uploadFile({
      url: 'https://collhome.com/api/images/upload',
      filePath: that.data.files[0],
      name: 'file',
      formData: {
        'content': that.data.content,
        'location': that.data.location,
      },
      success: function (res) {
        console.log('res', res);
      },
      fail: function (res) {
        console.log('fail.res', res);
      },
      complete: function (res) {
        console.log('complete.res', res);
      }

    })
  }

})