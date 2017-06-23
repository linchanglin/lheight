function getUptoken() {
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://collhome.com/tianjin-jidianzhiye/apis/uptoken',
            success: function (res) {
                let uptoken = res.data.uptoken;
                resolve(uptoken)
            }
        })
    })
}


function upload(uptoken, filePath, success, fail, complete) {
    let visit_url = 'http://cdn.collhome.com';
    let upload_url = 'https://upload-z2.qbox.me'
    let fileName = filePath.split('//')[1];
    let formData = {
        'token': uptoken,
        'key': fileName
    };
    wx.uploadFile({
        url: upload_url,
        filePath: filePath,
        name: 'file',
        formData: formData,
        success: function (res) {
            let dataString = res.data
            let dataObject = JSON.parse(dataString);
            let key = dataObject.key;
            //do something
            let imageUrl = `${visit_url}/${key}`;
            dataObject.imageURL = imageUrl;
            console.log(dataObject);
            if (success) {
                success(dataObject);
            }
        },
        fail: function (error) {
            console.error(error);
            if (fail) {
                fail(error);
            }
        },
        complete: function (done) {
            console.log('upload one file complete', done);
            if (complete) {
                complete(done);
            }
        }
    })
}

module.exports = {
    getUptoken: getUptoken,
    upload: upload
}