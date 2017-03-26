var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["热门", "本校", "附近"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,


    markers: [{
      iconPath: "/pages/images/m1.jpg",
      id: 0,
      latitude: 26.0597592181,
      longitude: 119.1977521459,
      width: 50,
      height: 70,
      title: '刘亦菲'
    }],
    controls: [{
      id: 1,
      iconPath: '/pages/images/m2.jpg',
      position: {
        left: 0,
        top: 100,
        width: 50,
        height: 70
      },
      clickable: true
    }],
    circles: [
      {
        latitude: 26.0597592181,
        longitude: 119.1977521459,
        color: '#000000AA',
        fillColor: '#000000AA',
        radius: 3,
        strokeWidth: 3,


      }
    ]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});