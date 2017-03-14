var app = getApp()

Page({
  data: {
    date: "2016-09-01",

    colleges: ["福州大学", "福建师范大学", "福建师大协和学院", "福建医科大学", "福建中医药大学", "福建农林大学", "福建工程学院", "闽江学院", "江夏学院", "福州教育学院", "华南女子学院", "福州职业技术学院"],
    collegeIndex: 0,

  },
  onLoad: function () {
    let that = this;
    app.getUserInfo(function (userInfo) {
      console.log('uerInfo', userInfo);
      that.setData({
        userInfo: userInfo
      })
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindCollegeChange: function(e) {
        console.log('picker country 发生选择改变，携带值为', e.detail.value);

        this.setData({
            collegeIndex: e.detail.value
        })
    },
})