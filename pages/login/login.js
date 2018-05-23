// pages/login/login.js
import { store } from './store';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:true,
    login:{
      mobile:"",
      code:"",
      codeLocked:false,
      lockedTime:60
    },
    users:[],
    select_user_uuid:"",
    plats:[],
    select_plat_uuid:"",
    showLoginBox:false
  },
  canILogin(){
    if(!wx.canIUse('button.open-type.getUserInfo')){
      wx.showModal({
        title: '微信版本太旧',
        content: '使用旧版本微信无法登录，请升级您的微信版本',
      })
    }
  },
  login(userinfo){
    console.log(userinfo)
    this.setData({
      userInfo: userinfo.detail.userInfo,
      hasUserInfo: true
    })
    app.login(userinfo.detail,(err,res) => {
      if (app.globalData.userInfo) {
        
      }



      this.goLogin();
    })
  },






  goLogin(){
    if (!this.data.login.mobile) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.data.login.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    clearInterval(app.globalData.timer);
    //存一份mobile
    app.globalData.mobile = this.data.login.mobile;
    app.setLocalStorage('mobile',this.data.login.mobile);

    store.login({mobile:this.data.login.mobile,code:this.data.login.code},(resp) => {
      // console.log(resp)
      
      this.setData({
        "users": resp.users,
        "plats":resp.plats && resp.plats || []
      })
      
      this.setData({
        isLogin: false
      })

    },(resp) => {
      wx.showToast({
        title: resp.msg,
        icon: 'none',
        duration: 2000
      })

    })

    
  },
  goMy(){
    if (!this.data.select_user_uuid){
      wx.showToast({
        title: "请选择登录账号",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let obj = null;
    for(var items of this.data.users){
      if (items.user.uuid == this.data.select_user_uuid){
        obj = items;
      }
    }
    if(obj){
      store.getUserByTicket({ticket:obj.ticket},(resp) => {
        // console.log(resp);
        app.globalData.token = resp.token;
        app.globalData.user = resp.user;

        app.setLocalStorage('token',resp.token);



        if(obj.user.platId){
          store.getOrgDetail({orgId:obj.user.platId},(data) => {
            app.globalData.plat = data.org;
          })
        }


        let url = "/pages/info/info";
        wx.switchTab({
          url: url
        })
      })
    }
  },
  goApply(){
    if (!this.data.select_plat_uuid) {
      wx.showToast({
        title: "请选择申请平台",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let obj = null;
    for (var items of this.data.plats) {
      if (items.uuid == this.data.select_plat_uuid) {
        obj = items;
      }
    }

    let name = obj.name || '';


    let url = '/pages/apply/apply?plat_id='+this.data.select_plat_uuid+'&plat_name='+name;
    wx.navigateTo({
      url: url
    })
  },
  setLoginMobile(e){
    var mobile = e.detail.value;
    this.setData({
      "login.mobile":mobile
    })
  },
  setLoginCode(e) {
    var code = e.detail.value;
    this.setData({
      "login.code": code
    })
  },
  getCode(){//获取验证码
    if (this.data.login.codeLocked){//验证码锁定
      return false;
    }

    if(!this.data.login.mobile){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    this.setData({
      "login.codeLocked":true
    })
    app.globalData.timer = setInterval(() => {
      var temp = this.data.login.lockedTime;
      temp--;
      console.log(temp)
      this.setData({
        "login.lockedTime":temp
      })
      if(temp <=0 ){
        this.setData({
          "login.codeLocked": false,
          "login.lockedTime":60
        })
        clearInterval(app.globalData.timer);
      }
    },1000)

    store.getMobileCode({mobile:this.data.login.mobile},(resp) => {
      wx.showToast({
        title: '验证码发送成功',
        icon: 'success',
        duration: 2000
      })
      console.log(resp);
      wx.showModal({
        title: '验证码',
        content: resp.code,
        success: function (res) {
   
        }
      })



    })


  },
  selectUser(e){
    const uuid = e.target.dataset.uuid;
    this.setData({
      "select_user_uuid":uuid
    })

  },
  selectPlat(e) {
    const uuid = e.target.dataset.uuid;
    this.setData({
      "select_plat_uuid": uuid
    })

  },
  

  getUserInfo() {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // }else {
    //   app.checkUserAuth();
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = app.getLocalStorage('token');
    if(token){
      app.globalData.token = token;

      let mobile = app.getLocalStorage('mobile');
      let userInfo = app.getLocalStorage('userInfo');
      let userOpen = app.getLocalStorage('userOpen');

      app.globalData.mobile = mobile;
      app.globalData.userInfo = userInfo;
      app.globalData.userOpen = userOpen;

      store.getUserMy({token},(resp) => {
        console.log(resp)
        app.globalData.user = resp.user;
        let url = "/pages/info/info";
        wx.switchTab({
          url: url
        })
        
      },() => {//获取失败，跳转登录
        wx.clearStorage();
        wx.navigateTo({
          url: '/pages/login/login'
        })
      })
    }else{
      this.setData({
        showLoginBox:true
      })
    }





  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
})