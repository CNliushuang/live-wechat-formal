// created by gpake
(function() {

var config = {
    qiniuRegion: '',
    qiniuImageURLPrefix: '',
    qiniuUploadToken: '',
    qiniuUploadTokenURL: '',
    qiniuUploadTokenFunction: null,
    qiniuShouldUseQiniuFileName: false
}

module.exports = {
    init: init,
    upload: upload,
}

// 在整个程序生命周期中，只需要 init 一次即可
// 如果需要变更参数，再调用 init 即可
function init(options) {
    config = {
        qiniuRegion: '',
        qiniuImageURLPrefix: '',
        qiniuUploadToken: '',
        qiniuUploadTokenURL: '',
        qiniuUploadTokenFunction: null,
        qiniuShouldUseQiniuFileName: false
    };
    updateConfigWithOptions(options);
}

function updateConfigWithOptions(options) {
    if (options.region) {
        config.qiniuRegion = options.region;
    } else {
        console.error('qiniu uploader need your bucket region');
    }
    if (options.uptoken) {
        config.qiniuUploadToken = options.uptoken;
    } else if (options.uptokenURL) {
        config.qiniuUploadTokenURL = options.uptokenURL;
    } else if(options.uptokenFunc) {
        config.qiniuUploadTokenFunction = options.uptokenFunc;
    }
    if (options.domain) {
        config.qiniuImageURLPrefix = options.domain;
    }
    config.qiniuShouldUseQiniuFileName = options.shouldUseQiniuFileName
}

function upload(filePath, success, fail, options) {
  console.log("start upload")



    if (null == filePath) {
        console.error('qiniu uploader need filePath to upload');
        return;
    }
    if (options) {
      updateConfigWithOptions(options);
    }
    if (config.qiniuUploadTokenFunction) {
      config.qiniuUploadTokenFunction((token) => {
        config.qiniuUploadToken = token;
        doUpload(filePath, success, fail, options);
      });

      // config.qiniuUploadToken = config.qiniuUploadTokenFunction();

      // if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
      //     console.error('qiniu UploadTokenFunction result is null, please check the return value');
      //     return
      // }
    }else if (config.qiniuUploadToken) {
        doUpload(filePath, success, fail, options);
    } else if (config.qiniuUploadTokenURL) {
        getQiniuToken(function() {
            doUpload(filePath, success, fail, options);
        });
    }else {
        console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
        return;
    }
}

function doUpload(filePath, success, fail, options) {
    if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
        console.error('qiniu UploadToken is null, please check the init config or networking');
        return
    }
    var url = uploadURLFromRegionCode(config.qiniuRegion);
    var fileName = filePath.replace(/.+\//, '');
    if (options && options.key) {
        fileName = options.key;
    }
    var formData = {
        'token': config.qiniuUploadToken
    };
    if (!config.qiniuShouldUseQiniuFileName) {
      // formData['key'] = fileName
    }
    // console.log(formData);
    wx.uploadFile({
        url: url,
        filePath: filePath,
        name: 'file',
        formData: formData,
        success: function (res) {
          // console.log(res);
          var dataString = res.data
          try {
            var dataObject = JSON.parse(dataString);
            //do something
            var file = JSON.parse(dataObject.file)
            if (success) {
              success(file);
            }
          } catch(e) {
            console.log('parse JSON failed, origin String is: ' + dataString)
            if (fail) {
              fail(e);
            }
          }
        },
        fail: function (error) {
            console.error(error);
            if (fail) {
                fail(error);
            }
        }
    })
}

function getQiniuToken(callback) {
  wx.request({
    url: config.qiniuUploadTokenURL,
    success: function (res) {
      var token = res.data.uptoken;
      if (token && token.length > 0) {
        config.qiniuUploadToken = token;
        if (callback) {
            callback();
        }
      } else {
        console.error('qiniuUploader cannot get your token, please check the uptokenURL or server')
      }
    },
    fail: function (error) {
      console.error('qiniu UploadToken is null, please check the init config or networking: ' + error);
    }
  })
}

function uploadURLFromRegionCode(code) {
    var uploadURL = null;
    switch(code) {
      case 'ECN': uploadURL = 'https://up-z1.qbox.me'; break;
        case 'NCN': uploadURL = 'https://up-z1.qbox.me'; break;
        case 'SCN': uploadURL = 'https://up-z2.qbox.me'; break;
        case 'NA': uploadURL = 'https://up-na0.qbox.me'; break;
        default: console.error('please make the region is with one of [ECN, SCN, NCN, NA]');
    }
    return uploadURL;
}

})();