// pages/videoUrlInput/videoUrlInput.js
Page({
  data:{},
  onLoad: function (option) {
    console.log('option',option);
    let that = this;
    
    if(option.video_url) {
      that.setData({
        video_url: option.video_url
      })
    }
  },
  bindContentInput: function (e) {
    let value = e.detail.value;
    wx.setStorageSync('video_url', value);
  },
  confirmInput: function() {
    wx.navigateBack();
  }
})