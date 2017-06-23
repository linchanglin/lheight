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
	bindContentInput: function (e) {
		this.setData({
			content: e.detail.value
		})
	},
	confirmInput: function () {
		let that = this;
        console.log('confirmInput    that.data.comment_id', that.data.content);
        console.log('confirmInput    that.data.comment_id', that.data.objectUser_id);

		let comment_id = that.data.comment_id;
		wx.request({
			url: `https://collhome.com/tianjin-jidianzhiye/apis/comments/${comment_id}/replies`,
			method: 'POST',
			data: {
				wesecret: that.data.wesecret,
				content: that.data.content,
				objectUser_id: that.data.objectUser_id
			},
			success: function (res) {
				console.log('post reply', res.data)
                wx.setStorageSync('comments_need_refresh', comment_id);
				wx.setStorageSync('replies_need_refresh_create_reply', 1);
				wx.navigateBack()
			}
		})
	}
})