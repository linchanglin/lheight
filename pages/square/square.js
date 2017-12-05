let app = getApp()
let deviceInfo = app.data.deviceInfo;
let windowWidth = deviceInfo.windowWidth;
let theme_image_width = (windowWidth - 45) / 2;

Page({
  data: {
    imgUrls: [
      'http://mmbiz.qpic.cn/mmbiz/wJ1zCBmADTGcvaOfIId1RyZ5QctTGuic7LvsuBR5LSebkuicyN01TKMk7uy2wdiaia2PDZaaWQsZkItI6JC0qPyK7Q/0',
      'http://mmbiz.qpic.cn/mmbiz/wJ1zCBmADTG51P470aib7ZiburTZ41jdqX8thOo4pibZ5ibiaQaKoGG5bibCDJ5D6Sfxrrgc7G9tW4RdShcmKmuhTXpw/0',
      'http://mmbiz.qpic.cn/mmbiz/wJ1zCBmADTGS87cogy6cEPmxNqfMsTdCHDxEaLBCTmAmUXicfdlcQxa6P6h8UFoqB98ia0WjVtN8CVACulXHyH0w/0',

    ],
    img: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
    
    selectedLab: 'topic'
  },
  onLoad: function () {
    let that = this;
    that.setData({
      theme_image_width: theme_image_width
    })



    // const backgroundAudioManager = wx.getBackgroundAudioManager()

    // backgroundAudioManager.title = '此时此刻'
    // backgroundAudioManager.epname = '此时此刻'
    // backgroundAudioManager.singer = '汪峰'
    // backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // backgroundAudioManager.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46' // 设置了 src 之后会自动播放




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