

App({
    data: {
        deviceInfo: {},
        sliderWidth: 96,
        ww:'',
        image_width:'',
        appId: 'wx6700db6c36e6eed1',
        appSecret: '3220627137eaa581d7061a7bc4b11c66',
        template_id_comment: 'JoC-lW0-3dkHEDzVv_hSdsDA3ZFAwS3vUZqLyybhp5I',
        template_id_reply: '_TBgH7x2J3mOogsE2wiv1ZLzBtWL1Osk-6ASLjCdJdQ'
    },
    onLaunch: function () {
        let res = wx.getSystemInfoSync();
        this.data.deviceInfo = res;
        let ww = res.windowWidth - 20;
        this.data.ww = ww;
        this.data.image_width = (ww - 2) / 3;

        console.log('this.data.image_width', this.data.image_width);
    }
})