// pages/apply/apply.js

const qiniuUploader = require("../../utils/qiniuUploader");
import { config } from '../../utils/config'
import { httpAgent } from '../../utils/util'

const baseUrl = config.formal.server;
const api = '/api';
const app = getApp()
import { store } from './store';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:1,
    img_1:{},
    img_2:{},
    img_3:{},
    plat_id: "CZGy7gpuUykb5Q3BkyNste",
    plat_name:"测试平台",
    user:{
      identityName:"",
      qq:"",
      wechat:"",
      summary:""
    },
    is_apply:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.plat_id) {
      this.setData({
        plat_id: options.plat_id
      })
    }
    if (options.plat_name) {
      this.setData({
        plat_name: options.plat_name
      })
    }
  },
  goUpload(e) {
    var that = this;
    var files = [];
    console.log(e.target);
    const index = e.target.dataset.num;

    // 选择图片
    wx.chooseImage({
      count: this.data.count || 1,
      success: (res) => {
        console.log(res);
        for (var items of res.tempFiles) {
          items.expand = items.path.replace(/.+\./, '');
          items.name = items.path.replace(/.+\//, '');
          items.url = items.path;
          files.push(items);
        }
       

        /*挨个上传至七牛*/
        for (var i = 0; i < files.length; i++) {
          if (!files[i].uuid) {
            this.startUpload(files[i], index);
          }
        }

      }
    })
  },
  startUpload(file, index) {
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
      // var files = this.data.files;
      // files.splice(index, 1, res);
      // this.setData({
      //   files: files
      // })
      console.log(res);
      console.log(index);
      if(index == 1){
        that.setData({
          img_1:res
        })
      }else if(index  == 2){
        that.setData({
          img_2: res
        })
      } else if (index == 3) {
        that.setData({
          img_3: res
        })
      }
    }, (error) => {
      console.log('error: ' + error);
    }, {
        region: 'ECN',
        times: new Date().getTime(),
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
            let url = baseUrl + api + '/files/storage/ticket/unlogin.json';
            url = url + '?name='+file.name+'&type=0'
            const params = {
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
  changeInfo(e){
    var s_type = e.target.dataset.type;
    var val = e.detail.value;
    var user = this.data.user;
    user[s_type] = val;
    this.setData({
      user:user
    })

  },
  submitApply(){
    if (!this.data.user.identityName){
      wx.showToast({
        title: "请输入你的真实姓名",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.data.user.qq && !this.data.user.wechat) {
      wx.showToast({
        title: "请至少填写一个联系方式",
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (!this.data.img_1.url && !this.data.img_2.url && !this.data.img_3.url){
      wx.showToast({
        title: "请至少上传一张近照",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let platId = this.data.plat_id;
    let platName = this.data.plat_name;
    let identityName = this.data.user.identityName;
    let summary = this.data.user.summary
    let qq = this.data.user.qq;
    let wechat = this.data.user.wechat;
    let mobile = app.globalData.mobile || '';
    let openId = app.globalData.userOpen.openId;
    let nickname = app.globalData.userInfo.nickName;
    let avatarUrl = app.globalData.userInfo.avatarUrl;



    let attachments = [];
    if(this.data.img_1.uuid){
      attachments.push({uuid:this.data.img_1.uuid})
    }
    if (this.data.img_2.uuid) {
      attachments.push({ uuid: this.data.img_2.uuid })
    }
    if (this.data.img_3.uuid) {
      attachments.push({ uuid: this.data.img_3.uuid })
    }

    store.applyActor({ nickname, avatarUrl, mobile, openId, platId, platName, identityName, summary, qq, attachments,wechat},() => {
      this.setData({
        is_apply:false
      })
    })
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