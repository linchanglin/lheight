var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["热门", "本校", "附近"],
    activeIndex: 2,
    sliderOffset: 0,
    sliderLeft: 0,

  },
  onLoad: function () {
    var that = this;

    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      that.setData({
        wesecret: wesecret
      })
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow: function () {
    let that = this;

    if (that.data.wesecret) {
      that.load_user();
    } else {
      let wesecret = wx.getStorageSync('wesecret');
      if (wesecret) {
        that.setData({
          wesecret: wesecret
        })
        that.load_user();
      } else {
        that.load_loves();
      }
    }
  },
  load_user: function () {
    let that = this;
    let url = 'https://collhome.com/api/user?wesecret=' + that.data.wesecret

    wx.request({
      url: url,
      success: function (res) {
        console.log('user', res.data)

        that.setData({
          userInfo: res.data.data
        })

        that.load_loves();
      }
    })
  },
  load_loves: function () {
    let that = this;
    let activeIndex = that.data.activeIndex

    let url;
    if (that.data.wesecret) {
      if (activeIndex == 0) {
        url = 'https://collhome.com/api/hotLoves?wesecret=' + that.data.wesecret;
      } else if (activeIndex == 1) {
        console.log('that.userInfo00000000000', that.data.userInfo);
        if (that.data.userInfo.college == '') {
          that.showNoCollegeModal();
          return
        } else {
          url = 'https://collhome.com/api/collegeLoves?wesecret=' + that.data.wesecret;
        }
      } else {
        url = 'https://collhome.com/api/locationLoves?wesecret=' + that.data.wesecret;
      }
    } else {
      if (activeIndex == 0) {
        url = 'https://collhome.com/api/hotLoves';
      } else if (activeIndex == 1) {
        that.setData({
          loves: []
        })
        that.showNoCollegeModal();
        return
      } else {
        url = 'https://collhome.com/api/locationLoves';
      }
    }

    wx.request({
      url: url,
      success: function (res) {
        console.log(res.data)
        let loves = res.data.data;
        that.setData({
          loves: loves
        })
      }
    })

  },

  showNoCollegeModal: function () {
    let that = this;
    wx.showModal({
      title: '未知学校',
      content: '您尚未选择您的学校呢，请去 我 -> 修改信息 -> 学校 选择您的学校！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  tabClick: function (e) {
    let that = this;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    that.load_loves();
  },

  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log('e', e.markerId)
    let love_id = e.markerId;
    wx.navigateTo({
      url: '../comment/comment?love_id=' + love_id
    });
  },
  controltap(e) {
    console.log(e.controlId)
  }

});