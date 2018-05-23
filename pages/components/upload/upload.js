// pages/components/upload/upload.js
const qiniuUploader = require("../../../utils/qiniuUploader");
import { config } from '../../../utils/config'
import { httpAgent, showMsg } from '../../../utils/util'

const baseUrl = config.formal.app01;
const api = config.project + '/api';
const proxy = config.project + '/proxy';
const app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {
    timestamp:"",
    count:9,
    files:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.timestamp) {
      this.setData({
        timestamp: options.timestamp,
      })
      const count = app.globalData.uploadFiles[options.timestamp + '_count'];
      this.setData({
        'count': count
      })
      const files = app.globalData.uploadFiles[options.timestamp + '_files'];
      this.setData({
        'files': files
      })
      this.goUpload();
    }
  },
  goUpload(){
    var that = this;
    var files = this.data.files;
    var result = [];
    // 选择图片
    wx.chooseImage({
      count: this.data.count || 9,
      success: (res) => {
        console.log(res);
        for (var items of res.tempFiles){
          items.expand = items.path.replace(/.+\./, '');
          items.name = items.path.replace(/.+\//, '');
          items.url = items.path;
          files.push(items);
        }
        this.setData({
          'files':files
        })

        /*挨个上传至七牛*/
        for(var i=0;i<files.length;i++){
          if(!files[i].uuid){
            this.startUpload(files[i], i);
          }
        }

      }
    })
  },
  startUpload(file,index){
    console.log("upload#@!");
    var that = this;
    // 交给七牛上传
    qiniuUploader.upload(file.url, (res) => {
      // 每个文件上传成功后,处理相关的事情
      // 其中 info 是文件上传成功后，服务端返回的json，形式如
      // {
      //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
      //    "key": "gogopher.jpg"
      //  }
      // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
      // console.log(res);
      // callback && callback(res);
      // console.log(res);
      // console.log(index)
      var files = this.data.files;
      files.splice(index,1,res);
      this.setData({
        files:files
      })

    }, (error) => {
      console.log('error: ' + error);
    }, {
        region: 'ECN',
        times:new Date().getTime(),
        domain: 'qiniu-file01.yugusoft.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
        // key: 'customFileName.jpg', // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
        // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
        // uptoken: '[yourTokenString]', // 由其他程序生成七牛 uptoken
        // uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
        uptokenFunc: function (cb) {
          console.log("abc#####")

          return new Promise((resolve, reject) => {
            const expand = file.expand;
            const name = file.name;
            const url = baseUrl + api + '/files/qiniu/upload_ticket.json';
            const params = {
              token: app.globalData.token,
              req_type: 'general_file',
              name: name,
              expand: expand
            }
            httpAgent(url, 'GET', params, (data) => {
              // console.log(data.ticket);
              cb && cb(data.ticket);
            })
          })
        }
      }
    );
  },
  deleteFiles(e){
    var index = e.currentTarget.dataset.index;
    var files = this.data.files;
    files.splice(index,1);
    this.setData({
      files:files
    })

  },
  submit(){
    var files = this.data.files;
    if (this.data.timestamp && app.globalData.uploadFiles[this.data.timestamp + '_callback']) {
      app.globalData.uploadFiles[this.data.timestamp + '_callback'](files);
    }
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})