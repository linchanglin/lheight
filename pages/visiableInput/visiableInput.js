// pages/collegeInput/collegeInput.js
Page({
  data: {
    radioItems: [
      { name: '公开', description: '所有人可见',value: '0' },
      { name: '仅本校', description: '仅本校学生可见',value: '1' },
      { name: '仅男生 ', description: '仅男生可见',value: '2' },
      { name: '仅女生', description: '仅女生可见',value: '3' },
      { name: '私密', description: '所自己可见',value: '4' },
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