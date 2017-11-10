App({
    data: {
        deviceInfo: {},
        sliderWidth: 96,
        ww:'',
        image_width:''
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