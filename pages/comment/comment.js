var app = getApp()
Page({
  data: {
    rippleName: "",
    length: 0,

    detail:
    {
      title: "犯错-双管巴乌",
      info: "小哥的声音真好。《一剪梅》改了这么多版，还是这版耐听。如泣如诉，余音袅袅。",
      uName: "雨碎江南",
      isVideo: true,
      browse: 4299,
      like: 2113,
      comment: 789,
      time: "昨天"
    },
    comments: [
      {
        uName: "😝雨碎江南",
        time: "2016-12-11",
        content: "九九八十一难，最难过的，其实是女儿国这一关，因为比起其他的艰难困苦来说，此时的唐僧是真的动心了，一句“来生若有缘分”道尽一切，只是为了心中崇高的理想，纵使心动也要断绝柔情继续西行。为国王惋惜，同时也对唐僧充满崇敬，尤其是了解了史上真实的唐玄奘以后，更是觉得此人了不起。"
      },
      {
        uName: "张珊珊",
        time: "2016-12-11",
        content: "音乐不分年纪，不过令人开心的是你们也不会年轻太久。😝😝😝😝"
      },
      {
        uName: "麦田的守望者",
        time: "2016-12-11",
        content: "看的时候还很小，不太明白里面的故事，长大后才发现西游记里水太深了。😢😢😡😡😼😼🍆🍇🍇🍆👧👰👨💑💇💅🐶🐶🙏✈🚲🚲😡😅👿😖😨😢😻🚃🚃🚌"
      },
      {
        uName: "~LUCK",
        time: "2016-12-11",
        content: "86版《西游记》绝对是那代人的国民记忆，放假天天等着看，一遍又一遍，悟空被压在五指山下经历春夏秋冬，寒冬大雪里一个人吃雪，路过的小牧童送来水果，那一段我和小伙伴们哭的稀里哗啦，当年的特技后期制作还很落后，但所有演员都是用心在塑造角色，没有艳俗的服装造型，良心制作！ 以后会陪孩子再看"
      },
      {
        uName: "沃德天·娜么帥",
        time: "2016-12-11",
        content: "想起，小时候，父亲教我这首歌的样子。"
      },
      {
        uName: "雨碎江南",
        time: "2016-12-11",
        content: "我的宿命，分两段， 未遇见你时，和遇见你以后。 你治好我的忧郁，而后赐我悲伤。 忧郁和悲伤之间的片刻欢喜， 透支了我生命全部的热情储蓄。 想饮一些酒，让灵魂失重，好被风吹走。 可一想到终将是你的路人， 便觉得，沦为整个世界的路人。 风虽大，都绕过我灵魂。"
      },
      {
        uName: "雨碎江南",
        time: "2016-12-01",
        content: "九九八十一难，最难过的，其实是女儿国这一关，因为比起其他的艰难困苦来说，此时的唐僧是真的动心了，一句“来生若有缘分”道尽一切，只是为了心中崇高的理想，纵使心动也要断绝柔情继续西行。为国王惋惜，同时也对唐僧充满崇敬，尤其是了解了史上真实的唐玄奘以后，更是觉得此人了不起。"
      }
    ],

  },

  onLoad: function (options) {
    let that = this;

    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      that.setData({
        wesecret: wesecret
      })
    }

    wx.request({
      url: 'https://collhome.com/api/loves/1/comments?wesecret=' + that.data.wesecret, 
      success: function (res) {
        console.log(res.data)
      }
    })

  },
  onShow: function () {
    console.log('111111');
  },
  setRipple: function () {
    var that = this;
    that.setData({
      rippleName: "bounceIn"
    });
    if (that.data.length == 0) {
      that.setData({
        length: 1
      })
    } else {
      that.setData({
        length: 0
      })
    }
    setTimeout(function () {

      that.setData({
        rippleName: ""
      });
    }, 1000)
  },
  deleteArticle: function () {
    wx.showModal({
      title: '提示',
      content: '要删除这条表白吗？',
      confirmColor: '#ff0000',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  }
})