// pages/loveInput/loveInput.js
Page({
  data: {
    files: [],
    content: "",
    location: {},
    visiable: 0,
    location_exist: 0,
    nickname: false,
    videoUrl_exist: 0,
    save_loading: 0
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
    let visiable = wx.getStorageSync('visiable');
    if (visiable) {
      that.setData({
        visiable: visiable
      });
      wx.removeStorageSync('visiable');
    }
    let video_url = wx.getStorageSync('video_url');
    if (video_url) {
      that.setData({
        videoUrl_exist: 1,
        video_url: video_url
      });
      wx.removeStorageSync('video_url');
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
    if (that.data.content.length > 0 || that.data.files.length > 0) {
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
    let that = this;
    that.setData({
      content: e.detail.value
    })

    that.set_loading_status();
  },
  switchChange: function (e) {
    console.log("switchChange e", e);
    let that = this;

    let value = e.detail.value;
    if (value) {
      that.setData({
        nickname: true
      })
    } else {
      that.setData({
        nickname: false
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
  navigateToVisiableInput: function () {
    let that = this;
    wx.navigateTo({
      url: `../visiableInput/visiableInput?visiable=${that.data.visiable}`
    })
  },
  saveLove: function () {
    let that = this;

    if (that.data.content.length > 0 || that.data.files.length > 0) {

      that.setData({
        save_loading: 2
      })

      wx.request({
        url: 'https://collhome.com/apis/loves',
        data: {
          'wesecret': that.data.wesecret,
          'content': that.data.content,
          'location': that.data.location,
          'visiable': that.data.visiable
        },
        method: 'POST',
        success: function (res) {
          console.log('res', res);
          let love_id = res.data.love_id;
          that.setData({
              love_id: love_id
          })

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
      url: 'https://collhome.com/apis/loves/images',
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
      save_loading: 1
    })
    wx.setStorageSync('board_loves_need_refresh_create_love', that.data.love_id);
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