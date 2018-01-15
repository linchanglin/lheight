// pages/commentInput/commentInput.js
import util from '../../utils/util.js';

let app = getApp()
let appId = app.data.appId;
let appSecret = app.data.appSecret;
let template_id_message = app.data.template_id_message;

Page({
  data: {},
  onLoad: function (options) {
    console.log('messageInput  options', options)
    let that = this;
    that.setData({
      to_user_id: options.userid,
      openid: options.openid
    })

    let wesecret = wx.getStorageSync('wesecret');
    that.setData({
      wesecret: wesecret
    })
  },
  formSubmit: function (e) {
    console.log('formSubmit e', e);
    let that = this;
    let form_id = e.detail.formId;
    let content = e.detail.value.content;
    console.log('formSubmit content', content);

    wx.request({
      url: 'https://collhome.com/life/apis/save_private_message',
      method: 'POST',
      data: {
        wesecret: that.data.wesecret,
        to_user_id: that.data.to_user_id,
        content: content
      },
      success: function (res) {
        console.log('post message', res.data)
        // wx.setStorageSync('comments_need_refresh_create_comment', that.data.love_id);
        // wx.setStorageSync('love_loves_need_refresh', that.data.love_id);
        // wx.setStorageSync('activity_loves_need_refresh', that.data.love_id);
        // wx.setStorageSync('question_loves_need_refresh', that.data.love_id);
        // wx.setStorageSync('find_loves_need_refresh', that.data.love_id);
        // wx.setStorageSync('mycomment_loves_need_refresh', that.data.love_id);
        // wx.setStorageSync('my_loves_need_refresh', that.data.love_id);
        if (res.data.code == 200) {
          that.navigateBackWithSuccess();
          that.send_templateMessage(form_id, content);
        } else {
          that.rejectWithReason(res.data.message);
        }

      }
    })
  },
  send_templateMessage: function (form_id, content) {
    let that = this;
    let openid = that.data.openid;
    let my_userInfo = wx.getStorageSync('my_userInfo');
    let realname = my_userInfo.realname;
    let now_date = util.formatTime(new Date());

    let data = {
      touser: openid,
      template_id: template_id_message,
      page: '/pages/message/message',
      form_id: form_id,
      data: {
        keyword1: {
          "value": content,
          "color": "#173177"
        },
        keyword2: {
          "value": realname,
        },
        keyword3: {
          "value": now_date,
        },
      }
    }
    console.log("data", data);

    wx.request({
      url: 'https://collhome.com/life/apis/send_templateMessage',
      method: 'POST',
      data: data,
      success: function (res) {
        console.log('send_templateMessage res', res);
      }
    })

  },
  // send_templateMessage: function (form_id, content) {
  //   let that = this;
  //   let openid = that.data.openid;
  //   let my_userInfo = wx.getStorageSync('my_userInfo');
  //   let realname = my_userInfo.realname;
  //   let now_date = util.formatTime(new Date());

  //   console.log("openid", openid);
  //   console.log("template_id_message", template_id_message);
  //   console.log("form_id", form_id);
  //   console.log("content", content);
  //   console.log("realname", realname);
  //   console.log("now_date", now_date);

  //   wx.request({
  //     url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
  //     success: function (res) {
  //       console.log('get_access_token res', res);

  //       let access_token = res.data.access_token;
        
  //       wx.request({
  //         url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${access_token}`,
  //         method: 'POST',
  //         data: {
  //           touser: openid,
  //           template_id: template_id_message,
  //           page: `/pages/message/message`,
  //           form_id: form_id,
  //           data: {
  //             keyword1: {
  //               "value": content,
  //               "color": "#173177"
  //             },
  //             keyword2: {
  //               "value": realname,
  //             },
  //             keyword3: {
  //               "value": now_date,
  //             },
  //           }
  //         },
  //         success: function (res) {
  //           console.log('send_templateMessage res', res);
  //         }
  //       })
  //     }
  //   })
  // },
  navigateBackWithSuccess: function () {
    let that = this;

    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    });

    setTimeout(function () {
      wx.navigateBack()
    }, 1000)
  },
  rejectWithReason: function (message) {
    wx.showModal({
      title: '发送失败',
      content: message,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})