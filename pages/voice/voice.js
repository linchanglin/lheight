
Page({
  data: {
    imgUrls: [
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
      
    ],
    img: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
  },
  onLoad: function () {
    let that = this;

    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'http://cdn5.lizhi.fm/audio/2017/08/27/2621240402539593222_ud.mp3' /
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    setInterval(function() {
      that.setData({
        time: innerAudioContext.currentTime,
        duration: innerAudioContext.duration
      })
    },1000)
    

  }
})