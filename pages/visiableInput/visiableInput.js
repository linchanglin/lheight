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
  onLoad: function (option) {
    console.log('option',option);
    let visiable = option.visiable;

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == visiable;
    }

    this.setData({
      radioItems: radioItems
    });

  },
  radioChange: function (e) {
    let value = e.detail.value;
    wx.setStorageSync('visiable', value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });

    // setTimeout(function () {
      wx.navigateBack();

    // }, 100)
  }
})