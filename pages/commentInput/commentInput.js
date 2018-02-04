// pages/commentInput/commentInput.js
let app = getApp()
let appId = app.data.appId;
let appSecret = app.data.appSecret;
let template_id_comment = app.data.template_id_comment;

Page({
  data: {},
  onLoad: function (options) {
    console.log('commentInput  options', options)
    let that = this;
    that.setData({
      love_id: options.love_id,
      openid: options.openid,
      love_content: options.love_content
    })

    let wesecret = wx.getStorageSync('wesecret');
    that.setData({
      wesecret: wesecret
    })
  },
  saveFormid: function (form_id) {
    let that = this;
    let wesecret = wx.getStorageSync('wesecret');
    if (wesecret) {
      let data = {
        wesecret: wesecret,
        form_id, form_id
      }
      wx.request({
        url: 'https://collhome.com/life/apis/templateMessages',
        method: 'POST',
        data: data,
        success: function (res) {
          console.log('saveFormid res', res);
        }
      })
    }
  },
  formSubmit: function (e) {
    let that = this;
    let form_id = e.detail.formId;
    let content = e.detail.value.content;

    that.saveFormid(form_id);

    wx.request({
      url: 'https://collhome.com/life/apis/loves/' + that.data.love_id + '/comments',
      method: 'POST',
      data: {
        wesecret: that.data.wesecret,
        content: content,
        form_id: form_id
      },
      success: function (res) {
        console.log('post comment', res.data)
        wx.setStorageSync('comments_need_refresh_create_comment', that.data.love_id);
        wx.setStorageSync('love_loves_need_refresh', that.data.love_id);
        // wx.setStorageSync('activity_loves_need_refresh', that.data.love_id);
        // wx.setStorageSync('question_loves_need_refresh', that.data.love_id);
        // wx.setStorageSync('find_loves_need_refresh', that.data.love_id);
        wx.setStorageSync('mycomment_loves_need_refresh', that.data.love_id);
        wx.setStorageSync('my_loves_need_refresh', that.data.love_id);

        wx.navigateBack()

        that.send_templateMessage(form_id, content);
      }
    })
  },
  send_templateMessage: function (form_id, content) {
    let that = this;
    let openid = that.data.openid;
    let love_id = that.data.love_id;
    let love_content = that.data.love_content;
    let my_userInfo = wx.getStorageSync('my_userInfo');
    let nickname = my_userInfo.nickname;

    let data = {
      touser: openid,
      template_id: template_id_comment,
      page: `/pages/comment/comment?love_id=${love_id}`,
      form_id: form_id,
      data: {
        keyword1: {
          "value": content,
          "color": "#173177"
        },
        keyword2: {
          "value": nickname,
        },
        keyword3: {
          "value": love_content,
        },
        keyword4: {
          value: "小程序具体页面更多精彩",
        }
      }
    };
    console.log("data", data);

    wx.request({
      url: 'https://collhome.com/life/apis/send_templateMessage',
      method: 'POST',
      data: data,
      success: function (res) {
        console.log('send_templateMessage res', res);
      }
    })

  }
  
  // send_templateMessage: function (form_id, content) {
  //   let that = this;
  //   let openid = that.data.openid;
  //   console.log("openid", openid);
  //   let love_id = that.data.love_id;
  //   let love_content = that.data.love_content;
  //   wx.request({
  //     url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
  //     success: function (res) {
  //       console.log('get_access_token res', res);
        
  //       let access_token = res.data.access_token;
  //       let my_userInfo = wx.getStorageSync('my_userInfo');
  //       let nickname = my_userInfo.nickname;
  //       wx.request({
  //         url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`,
  //         method: 'POST',
  //         data: {
  //           touser: openid,
  //           template_id: template_id_comment,
  //           page: `/pages/comment/comment?love_id=${love_id}`,
  //           form_id: form_id,
  //           data: {
  //             keyword1: {
  //               "value": content,
  //               "color": "#173177"
  //             },
  //             keyword2: {
  //               "value": nickname,
  //             },
  //             keyword3: {
  //               "value": love_content,
  //             },
  //             keyword4: {
  //               value: "小程序具体页面更多精彩",
  //             } 
  //           }
  //         },
  //         success: function (res) {
  //           console.log('send_templateMessage res', res);
  //         }
  //       })
  //     }
  //   })
  // }

})