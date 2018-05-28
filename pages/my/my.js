// pages/my/my.js
import { store } from './store';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    cashAccount:[],
    autoAccount:null,
    handleAccount:null,
    bankAccount:null,
    userInfo:null,
    agree:true,
    analyze:null,
    month:"",
    plat:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.user){
      this.setData({
        user:app.globalData.user
      })
    }

    if (app.globalData.userInfo){
      this.setData({
        userInfo:app.globalData.userInfo
      })
    }

    if (app.globalData.plat) {
      this.setData({
        plat: app.globalData.plat
      })
    }



    var date = new Date();
    this.setData({
      month:(date.getMonth()+1)+'月'
    })

    this.getCashAccount();
    // this.getUserInfo();
    this.getAnalyze();
  },
  getAnalyze(){
    store.getAnalyze({},(resp) => {
      this.setData({
        analyze: resp.analyze
      })
    })
  },
  getUserInfo(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getCashAccount(){
    store.getCashAccount({},(resp) => {
      console.log(resp);
      let handleAccount=null,autoAccount=null,bankAccount=null;
      if(resp.list && resp.list.length > 0){
        for(var items of resp.list){
          if (items.accountType == 1 && items.deleted == 0){
            handleAccount = items;
          }
          if (items.accountType == 0 && items.deleted == 0) {
            autoAccount = items;
          }

          if (items.accountType == 2 && items.deleted == 0) {
            bankAccount = items;
          }


        }
      }

      this.setData({
        cashAccount:resp.list,
        autoAccount:autoAccount,
        handleAccount: handleAccount,
        bankAccount:bankAccount
      })
    })
  },
  goBind(e){//绑定账号
    const cashType = e.target.dataset.type;
    console.log(cashType)
    const url = '/pages/bind/bind?cashType=' + cashType;
    wx.navigateTo({
      url: url
    })
  },
  viewBindBank(){//查看绑定账号
    const url = '/pages/bind/bind?cashType=BANK&opt=view';
    app.globalData.bankAccount = this.data.bankAccount;
    wx.navigateTo({
      url: url
    })
  },
  deleteBind(e){//删除绑定账号
    const uuid = e.target.dataset.uuid;
    store.deleteBindAccount({uuid},(resp) => {
      this.getCashAccount();
    })
  },
  goAutoCash(){//小额提现
    if(!this.data.agree){
      return false;
    }
    // if (!this.data.autoAccount){
    //   wx.showToast({
    //     title: '请选绑定小额提现账户',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }

     if (!this.data.bankAccount){
      wx.showToast({
        title: '请先认证身份信息及绑定银行卡',
        icon: 'none',
        duration: 2000
      })
      return false;
    }



    wx.navigateTo({
      url: '/pages/cash/cash?type=AUTO&account=' + JSON.stringify(this.data.autoAccount)
    })
  },
  goHandleCash() {//大额提现
    if (!this.data.agree) {
      return false;
    }
    // if (!this.data.handleAccount) {
    //   wx.showToast({
    //     title: '请选绑定大额提现账户',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }

    if (!this.data.bankAccount){
      wx.showToast({
        title: '请先认证身份信息及绑定银行卡',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    wx.navigateTo({
      url: '/pages/cash/cash?type=HANDLE&account=' + JSON.stringify(this.data.handleAccount)
    })
  },
  goBankCash(){
    if (!this.data.agree) {
      return false;
    }
    // if (!this.data.handleAccount) {
    //   wx.showToast({
    //     title: '请选绑定大额提现账户',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }

    if (!this.data.bankAccount){
      wx.showToast({
        title: '请先认证身份信息及绑定银行卡',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    wx.navigateTo({
      url: '/pages/cash/cash?type=HANDLE&account=' + JSON.stringify(this.data.bankAccount)
    })
  },
  agreeProtocol(){
    var result = !this.data.agree;
    this.setData({
      agree:result
    })
  },

  viewHelp(){
    const url = '/pages/help/help';
    wx.navigateTo({
      url: url
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
    if (app.globalData.user){
      this.setData({
        user:app.globalData.user
      })
    }

    if (app.globalData.userInfo){
      this.setData({
        userInfo:app.globalData.userInfo
      })
    }

    if (app.globalData.plat) {
      this.setData({
        plat: app.globalData.plat
      })
    }
    this.getCashAccount();
    this.getAnalyze();
    
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