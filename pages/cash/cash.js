// pages/cash/cash.js
import { store } from './store';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"AUTO",
    money:0,
    cashAccountName:"",
    identify:"",
    account:null,
    locked:false
  },
  goCash(){


    if(!this.data.money){
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    // if (!this.data.cashAccountName) {
    //   wx.showToast({
    //     title: '请输入真实姓名',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    // if (!this.data.identify) {
    //   wx.showToast({
    //     title: '请输入身份证号',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    console.log(this.data);


    let identityName = this.data.cashAccountName || '';
    let identityCardId = this.data.identify || '';
    let cashAccountId = this.data.account.uuid;
    let money = this.data.money;
    let content = "";

    if(!this.data.locked){
      this.setData({
        locked:true
      })
      setTimeout(() => {
        this.setData({
          locked:false
        })
      },5000)


      store.newCach({ identityName, identityCardId, cashAccountId, money, content},(resp) => {
        wx.showToast({
          title: "申请提现成功",
          icon: 'success',
          duration: 2000
        })

         this.setData({
          locked:false
        })
        wx.navigateBack({
          delta: 1
        })

      },(resp) => {
        wx.showToast({
          title: resp.msg,
          icon: 'none',
          duration: 2000
        })

         this.setData({
          locked:false
        })


        
      })








    }



    



  },
  changeName(e) {
    var name = e.detail.value;
    this.setData({
      cashAccountName:name
    })
  },
  changeMoney(e){
    var money = e.detail.value;
    console.log(money)

    this.setData({
      money: money
    })
  },
  changeIdentify(e){
    var identify = e.detail.value;
    this.setData({
      identify: identify
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    
    this.setData({
      type:options.type,
      account:JSON.parse(options.account)
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
})