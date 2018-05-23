//app.js
import { config } from './utils/config'

const baseUrl = config.formal.server;
const api = config.project + '/api';


App({
  onLaunch: function () {
    // if(!this.globalData.userOpen){
    //   this.getUserOpen();
    // }
    this.checkUserAuth();
  },
  checkUserAuth(){
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          if(!this.globalData.userOpen){
            // this.getUserOpen();
          }
        }else{
          // let url = '/pages/auth/auth';
          // wx.navigateTo({
          //   url: url,
          // })
        }
      }
    })
  },
  login(userinfo,callback){
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        var code = res.code;
       
        this.globalData.userInfo = userinfo.userInfo;
        this.setLocalStorage('userInfo',userinfo.userInfo);
        var encrypted_data = userinfo.encryptedData;
        var iv = userinfo.iv;
        let url = baseUrl + api + '/user/oauth2/wechat/weapp/decrypt.json';
        url = url + '?code=' + encodeURIComponent(code) + '&encrypted_data=' + encodeURIComponent(encrypted_data) + '&iv=' + encodeURIComponent(iv);
        wx.request({
          url: url,
          data: {
            // code: code,
            // encrypted_data: encrypted_data,
            // iv: iv
          },
          // header: {
          //   'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' // 默认值
          // },
          method: "POST",
          success: resps => {
            console.log(resps)
            this.globalData.userOpen = resps.data.userOpen;
            this.setLocalStorage('userOpen',resps.data.userOpen);

            callback();

          }
        })
      }
    })









  },


  getUserOpen(){
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        var code = res.code;
        wx.getUserInfo({
          success: resp => {
            console.log(resp);
            this.globalData.userInfo = resp.userInfo;
            this.setLocalStorage('userInfo',resp.userInfo);
            var encrypted_data = resp.encryptedData;
            var iv = resp.iv;
            let url = baseUrl + api + '/user/oauth2/wechat/weapp/decrypt.json';
            url = url + '?code=' + encodeURIComponent(code) + '&encrypted_data=' + encodeURIComponent(encrypted_data) + '&iv=' + encodeURIComponent(iv);
            wx.request({
              url: url,
              data: {
                // code: code,
                // encrypted_data: encrypted_data,
                // iv: iv
              },
              // header: {
              //   'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' // 默认值
              // },
              method: "POST",
              success: resps => {
                console.log(resps)
                this.globalData.userOpen = resps.data.userOpen;
                this.setLocalStorage('userOpen',resps.data.userOpen);

              }
            })
          }
        })
      }
    })
  },
  uploadFiles({ callback, count, files }) {//通用上传附件
    if (callback) {
      const timestamp = new Date().getTime() + '';
      this.globalData.uploadFiles = {
        [timestamp + '_callback']: callback,
        [timestamp + '_count']: count || 9,
        [timestamp + '_files']: files || [],
      };
      wx.navigateTo({
        url: '/pages/components/upload/upload?timestamp=' + timestamp
      })
    } else {
      console.error('callback is null');
    }
  },
  setLocalStorage(key,val){


    try {
        wx.setStorageSync(key, val)
    } catch (e) {    
    }


  },
  getLocalStorage(key){
    try {
      var value = wx.getStorageSync(key)
      if (value) {
          // Do something with return value
          return value;
      }
    } catch (e) {
      // Do something when catch error
    }





  },




  globalData: {
    userInfo: null,
    token: "f47a89d59fdc77dedce5158bd2ee73b6",//f95d4b2bd0038b3913da73b093bc7aa7
    plat_net:"wechat",
    timer:null,
    userOpen:null,
    uploadFiles:{},
    mobile:"",
    plat:null,
    bankAccount:null,
    "user": {
      "uuid": "985845549351702528",
      "id": 1029,
      "nickname": "УОуо.๑ˋ新主播",
      "avatarUrl": null,
      "sex": "MAN",
      "userType": "ACTOR",
      "loginName": "985845549351702528",
      "mobile": "18311344273",
      "email": null,
      "wechatId": null,
      "qqId": "39567910",
      "status": 0,
      "py": "уоуо.๑ˋxzb",
      "pinyin": "УОуо.๑ˋxinzhubo",
      "orgId": "Tw78jhzjNEqdnKwXc7vbX7",
      "orgName": "测试工会2",
      "org": null,
      "createDate": 1523878869000,
      "lastUpDate": 1523878869000,
      "platId": "CZGy7gpuUykb5Q3BkyNste",
      "platName": "测试平台",
      "unionId": "Tw78jhzjNEqdnKwXc7vbX7",
      "unionName": "测试工会2",
      "money": 0.0
    }
  }
})