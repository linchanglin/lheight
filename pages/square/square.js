let app = getApp()
let deviceInfo = app.data.deviceInfo;
let windowWidth = deviceInfo.windowWidth;
let theme_image_width = (windowWidth - 45) / 2;

Page({
  data: {
    imgUrls: [
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'

    ],
    img: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
    
    selectedLab: 'topic'
  },
  onLoad: function () {
    let that = this;
    that.setData({
      theme_image_width: theme_image_width
    })
  },
  tapVoice: function () {
    let that = this;
    that.setData({
      selectedLab: 'voice'
    })
  },
  tapTopic: function () {
    let that = this;
    that.setData({
      selectedLab: 'topic'
    })
  },
  navigateToVoice: function (e) {
    console.log('navigateToVoice', e);
    let that = this;
    wx.navigateTo({
      url: '../voice/voice'
    })
  },
})