/*
  * 将秒数格式化时间
  * @param {Number} seconds: 整数类型的秒数
  * @return {String} time: 格式化之后的时间
  */
function formatSeconds(sec) {
  let seconds = Math.round(sec);
  var min = Math.floor(seconds / 60),
    second = seconds % 60,
    hour, newMin, time;

  if (min > 60) {
    hour = Math.floor(min / 60);
    newMin = min % 60;
  }

  if (second < 10) { second = '0' + second; }
  if (min < 10) { min = '0' + min; }

  return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
}

Page({
  data: {
    playing: false,
    duration: '',
    currentTime: '',
    slider_max: '',
    slider_value: '',
    timer: '',
  },
  onLoad: function (options) {
    console.log('options', options);
    let that = this;
    let id = options.id;
    that.load_radio(id);

    that.setData({
      id: id
    })
  },
  onShareAppMessage: function () {
    let that = this;
    let title = that.data.radio.title;
    let id = that.data.id;
    return {
      title: title,
      path: `/pages/article/article?id=${id}`
    }
  },
  load_radio: function (id) {
    let that = this;
    wx.request({
      url: `https://collhome.com/life/apis/radios/${id}`,
      success: function (res) {
        let radio = res.data.data;
        that.setData({
          radio: radio
        })

        wx.setNavigationBarTitle({
          title: radio.title
        })

        const backgroundAudioManager = wx.getBackgroundAudioManager();
        backgroundAudioManager.title = radio.title;
        backgroundAudioManager.epname = radio.epname;
        backgroundAudioManager.singer = radio.author;
        backgroundAudioManager.coverImgUrl = radio.img_url;
        backgroundAudioManager.src = radio.url;

        backgroundAudioManager.onEnded(function () {
          backgroundAudioManager.title = radio.title;
          backgroundAudioManager.epname = radio.epname;
          backgroundAudioManager.singer = radio.author;
          backgroundAudioManager.coverImgUrl = radio.img_url;
          backgroundAudioManager.src = radio.url;
        })

        setTimeout(function () {
          backgroundAudioManager.pause();
        }, 100)
        setTimeout(function () {
          that.setData({
            currentTime: formatSeconds(backgroundAudioManager.currentTime),
            duration: formatSeconds(backgroundAudioManager.duration),
            slider_max: Math.round(backgroundAudioManager.duration)
          })
        }, 1000)
      }
    })
  },
  onUnload: function () {
    let that = this;
    clearInterval(that.data.timer);
  },
  play: function () {
    let that = this;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    if (that.data.playing) {
      backgroundAudioManager.pause();
      clearInterval(that.data.timer);
    } else {
      // backgroundAudioManager.title = that.data.title;
      // backgroundAudioManager.epname = that.data.epname;
      // backgroundAudioManager.singer = that.data.singer;
      // backgroundAudioManager.coverImgUrl = that.data.coverImgUrl;
      // backgroundAudioManager.src = that.data.src;
      backgroundAudioManager.play();
      let timer = setInterval(function () {
        console.log(formatSeconds(backgroundAudioManager.currentTime));
        console.log(formatSeconds(backgroundAudioManager.duration));
        that.setData({
          currentTime: formatSeconds(backgroundAudioManager.currentTime),
          duration: formatSeconds(backgroundAudioManager.duration),
          slider_value: Math.round(backgroundAudioManager.currentTime)
        })
      }, 1000)
      that.setData({
        timer: timer
      })
    }
    that.setData({
      playing: !that.data.playing
    })
  },
  sliderChange: function (e) {
    let that = this;
    let second = e.detail.value;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.seek(second);
    that.setData({
      slider_value: Math.round(second),
      currentTime: formatSeconds(second),
      duration: formatSeconds(backgroundAudioManager.duration)
    })
  },

})