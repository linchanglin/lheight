// // created by gpake
// (function () {

//     var config = {
//         qiniuRegion: '',
//         qiniuImageURLPrefix: '',
//         qiniuUploadToken: '',
//         qiniuUploadTokenURL: '',
//         qiniuUploadTokenFunction: null
//     }

//     module.exports = {
//         init: init,
//         upload: upload,
//     }

//     // 在整个程序生命周期中，只需要 init 一次即可
//     // 如果需要变更参数，再调用 init 即可
//     function init(options) {
//         config = {
//             qiniuRegion: '',
//             qiniuImageURLPrefix: '',
//             qiniuUploadToken: '',
//             qiniuUploadTokenURL: '',
//             qiniuUploadTokenFunction: null
//         };
//         updateConfigWithOptions(options);
//     }

//     function updateConfigWithOptions(options) {
//         console.log('options', options);
//         if (options.region) {
//             config.qiniuRegion = options.region;
//         } else {
//             console.error('qiniu uploader need your bucket region');
//         }
//         if (options.uptoken) {
//             config.qiniuUploadToken = options.uptoken;
//         } else if (options.uptokenURL) {
//             config.qiniuUploadTokenURL = options.uptokenURL;
//         } else if (options.uptokenFunc) {
//             config.qiniuUploadTokenFunction = options.uptokenFunc;
//         }
//         if (options.domain) {
//             config.qiniuImageURLPrefix = options.domain;
//         }
//     }

//     function upload(filePath) {
//         if (null == filePath) {
//             console.error('qiniu uploader need filePath to upload');
//             return;
//         } else {
//             doUpload(filePath);
//         }

//         // if (options) {
//         //     init(options);
//         // }
//         // if (config.qiniuUploadToken) {
//         //     doUpload(filePath, success, fail, complete, options);
//         // } else if (config.qiniuUploadTokenURL) {
//         //     getQiniuToken(function () {
//         //         doUpload(filePath, success, fail, complete, options);
//         //     });
//         // } else if (config.qiniuUploadTokenFunction) {
//         //     config.qiniuUploadToken = config.qiniuUploadTokenFunction();
//         //     if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
//         //         console.error('qiniu UploadTokenFunction result is null, please check the return value');
//         //         return
//         //     }
//         // } else {
//         //     console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
//         //     return;
//         // }
//     }

//     function doUpload(filePath) {
//         // if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
//         //     console.error('qiniu UploadToken is null, please check the init config or networking');
//         //     return
//         // }
//         var url = 'https://upload-z2.qbox.me'
//         // var url = uploadURLFromRegionCode(config.qiniuRegion);
//         var fileName = filePath.split('//')[1];
//         // if (options && options.key) {
//         //     fileName = options.key;
//         // }
//         var formData = {
//             // 'token': config.qiniuUploadToken,
//             'token': uptoken,
//             'key': fileName
//         };
//         wx.uploadFile({
//             url: url,
//             filePath: filePath,
//             name: 'file',
//             formData: formData,
//             success: function (res) {
//                 var dataString = res.data
//                 var dataObject = JSON.parse(dataString);
//                 //do something
//                 var imageUrl = config.qiniuImageURLPrefix + '/' + dataObject.key;
//                 dataObject.imageURL = imageUrl;
//                 console.log(dataObject);
//                 if (success) {
//                     success(dataObject);
//                 }
//             },
//             fail: function (error) {
//                 console.error(error);
//                 if (fail) {
//                     fail(error);
//                 }
//             },
//             complete: function (done) {
//                 console.log('upload one file complete', done);
//                 if (complete) {
//                     complete(done);
//                 }
//             }
//         })
//     }

//     // function getQiniuToken(callback) {
//     //   wx.request({
//     //     url: config.qiniuUploadTokenURL,
//     //     success: function (res) {
//     //       var token = res.data.uptoken;
//     //       if (token && token.length > 0) {
//     //         config.qiniuUploadToken = token;
//     //         if (callback) {
//     //             callback();
//     //         }
//     //       } else {
//     //         console.error('qiniuUploader cannot get your token, please check the uptokenURL or server')
//     //       }
//     //     },
//     //     fail: function (error) {
//     //       console.error('qiniu UploadToken is null, please check the init config or networking: ' + error);
//     //     }
//     //   })
//     // }

//     // function uploadURLFromRegionCode(code) {
//     //     var uploadURL = null;
//     //     switch (code) {
//     //         case 'ECN': uploadURL = 'https://up.qbox.me'; break;
//     //         case 'NCN': uploadURL = 'https://up-z1.qbox.me'; break;
//     //         // case 'SCN': uploadURL = 'https://up-z2.qbox.me'; break;
//     //         case 'SCN': uploadURL = 'https://upload-z2.qbox.me'; break;
//     //         case 'NA': uploadURL = 'https://up-na0.qbox.me'; break;
//     //         default: console.error('please make the region is with one of [ECN, SCN, NCN, NA]');
//     //     }
//     //     return uploadURL;
//     // }

// })();






function getUptoken() {
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://collhome.com/apis/uptoken',
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