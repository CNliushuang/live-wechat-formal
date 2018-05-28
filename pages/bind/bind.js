// pages/bind/bind.js
import { store } from './store';
const app = getApp();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashType:"AUTO",
    opt:"",
    wechat:{
      accountName:"",
      accountNum:""
    },
    zfb:{
      accountName: "",
      accountNum: ""
    },
    bank:{
      accountName:"",//真实姓名
      identityCardId:"",//身份证号
      bcName:"",//开户银行
      bcCity:"",//开户银行城市
      bcBranch:"",//开户支行
      accountNum:""//账号

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.cashType){
      this.setData({
        cashType: options.cashType
      })
    }
    if(options.opt){
      this.setData({
        opt: options.opt
      })
      let bankAccount = app.globalData.bankAccount;



      if(bankAccount){
        this.setData({
          bank: bankAccount
        })
      }



    }






  },
  changeNum(e){
    const cashType = e.target.dataset.type;
    const val = e.detail.value;
    if(cashType == "AUTO"){
      this.setData({
        "wechat.accountNum":val
      })
    }else{
      this.setData({
        "zfb.accountNum": val
      })
    }
  },
  changeName(e) {
    const cashType = e.target.dataset.type;
    const val = e.detail.value;
    if (cashType == "AUTO") {
      this.setData({
        "wechat.accountName": val
      })
    } else {
      this.setData({
        "zfb.accountName": val
      })
    }
  },

  changeBank(e){
    var key = e.target.dataset.type;
    var val = e.detail.value;
    var data = this.data.bank;
    data[key] = val;

    this.setData({
      bank:data
    })

  },



  goBindHandle(){
    if (!this.data.zfb.accountName){
      wx.showToast({
        title: "请输入真实姓名",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!this.data.zfb.accountNum) {
      wx.showToast({
        title: "请输入支付宝账号",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let accountName = this.data.zfb.accountName;
    let accountNum = this.data.zfb.accountNum;
    let cashType = this.data.cashType;
    let accountType = this.filterCashType(this.data.cashType);

    store.bindAccount({ accountNickname: accountNum, cashType, accountType, accountName, accountNum},(resp) => {
      wx.showToast({
        title: "绑定成功",
        icon: 'success',
        duration: 2000
      })

    })




  },
  goBindAuto(){
    if (!this.data.wechat.accountName) {
      wx.showToast({
        title: "请输入真实姓名",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    console.log(app.globalData)
    
    let accountName = this.data.wechat.accountName;
    let accountNum = app.globalData.userOpen.openId;
    let cashType = this.data.cashType;
    let accountType = this.filterCashType(this.data.cashType);

    let accountNickname = app.globalData.userInfo.nickName;



    store.bindAccount({ accountNickname: accountNickname, cashType, accountType, accountName, accountNum }, (resp) => {
      wx.showToast({
        title: "绑定成功",
        icon: 'success',
        duration: 2000
      })

    })




  },

  goBindBank(){
    var data = this.data.bank;
    console.log(data);
    if (!data.accountName) {
      wx.showToast({
        title: "请输入真实姓名",
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (!data.identityCardId) {
      wx.showToast({
        title: "请输入身份证号",
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (!data.bcName) {
      wx.showToast({
        title: "请输入开户银行",
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (!data.accountNum) {
      wx.showToast({
        title: "请输入银行卡号",
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (!data.bcCity) {
      wx.showToast({
        title: "请输入开户银行城市",
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (!data.bcBranch) {
      wx.showToast({
        title: "请输入开户支行",
        icon: 'none',
        duration: 2000
      })
      return false;
    }


    let accountName = this.data.bank.accountName;
    let cashType = 'HANDLE';
    let accountType = this.filterCashType(this.data.cashType);


    let identityCardId = this.data.bank.identityCardId;
    let bcName = this.data.bank.bcName;
    let bcCity = this.data.bank.bcCity;
    let bcBranch = this.data.bank.bcBranch;
    let accountNum = this.data.bank.accountNum;







    store.bindAccount({ accountNickname: accountNum, cashType, accountType, accountName, accountNum ,identityCardId,bcName,bcCity,bcBranch}, (resp) => {
      wx.showToast({
        title: "绑定成功",
        icon: 'success',
        duration: 2000
      })


      wx.navigateBack({
        delta: 1
      })

    })



  },
  filterCashType(key){
    let result = 0;
    switch(key){
      case 'HANDLE': result = 1; break;
      case 'AUTO': result = 0; break;
      case 'BANK': result = 2; break;
    }
    return result;
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