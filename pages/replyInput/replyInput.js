import util from '../../utils/util.js';

let app = getApp()
let appId = app.data.appId;
let appSecret = app.data.appSecret;
let template_id_reply = app.data.template_id_reply;

Page({
	data: {},
	onLoad: function (options) {
		console.log('replyInput  options', options)
		let that = this;
		that.setData({
      comment_id: options.comment_id,
      objectUser_id: options.user_id,
			objectUser_openid: options.openid,
		})

    let source_content;
    if (options.reply_content) {
      source_content = options.reply_content;
    } else {
      source_content = options.comment_content;
    }
    
		let wesecret = wx.getStorageSync('wesecret');
		that.setData({
			wesecret: wesecret,
      source_content: source_content
		})
	},
  formSubmit: function (e) {
    let that = this;
    let form_id = e.detail.formId;
    let content = e.detail.value.content;

		let comment_id = that.data.comment_id;
		wx.request({
			url: `https://collhome.com/life/apis/comments/${comment_id}/replies`,
			method: 'POST',
			data: {
				wesecret: that.data.wesecret,
				content: content,
				objectUser_id: that.data.objectUser_id
			},
			success: function (res) {
				console.log('post reply', res.data)
        wx.setStorageSync('comments_need_refresh', comment_id);
				wx.setStorageSync('replies_need_refresh_create_reply', 1);
				wx.navigateBack()

        that.send_templateMessage(form_id, content);
			}
		})
	},

  send_templateMessage: function (form_id, content) {
    let that = this;
    let openid = that.data.objectUser_openid;
    let comment_id = that.data.comment_id;
    let source_content = that.data.source_content;
    let now_data = util.formatTime(new Date());
    let my_userInfo = wx.getStorageSync('my_userInfo');
    let nickname = my_userInfo.nickname;

    let data = {
      touser: openid,
      template_id: template_id_reply,
      page: `/pages/reply/reply?comment_id=${comment_id}`,
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
          "value": now_data,
        },
        keyword4: {
          "value": source_content,
        },
        keyword5: {
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
  //   let openid = that.data.objectUser_openid;
  //   console.log("openid", openid);
  //   let comment_id = that.data.comment_id;
  //   let source_content = that.data.source_content;
  //   let now_data = util.formatTime(new Date());
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
  //           template_id: template_id_reply,
  //           page: `/pages/reply/reply?comment_id=${comment_id}`,
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
  //               "value": now_data,
  //             },
  //             keyword4: {
  //               "value": source_content,
  //             },
  //             keyword5: {
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