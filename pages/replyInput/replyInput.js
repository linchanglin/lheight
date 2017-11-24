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
			objectUser_id: options.user_id
		})

		let wesecret = wx.getStorageSync('wesecret');
		that.setData({
			wesecret: wesecret
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

        that.send_templateMessage(form_id);
			}
		})
	},

})