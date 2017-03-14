// pages/collegeInput/collegeInput.js
Page({
  data: {
    radioItems: [
      { name: '福州大学', value: '0' },
      { name: '福建师范大学', value: '1' },
      { name: '福建师大协和学院 ', value: '2' },
      { name: '福建医科大学', value: '3' },
      { name: '福建中医药大学', value: '4' },
      { name: '福建农林大学', value: '5' },
      { name: '福建工程学院', value: '6' },
      { name: '闽江学院', value: '7' },
      { name: '江夏学院', value: '8' },
      { name: '福州教育学院', value: '9' },
      { name: '华南女子学院', value: '10' },
      { name: '福州职业技术学院', value: '12' }
    ],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });

    setTimeout(function () {
      wx.navigateBack();

    }, 300)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})