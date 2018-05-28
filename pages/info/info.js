// pages/my/my.js
import { store } from './store';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    userInfo:null,
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





  },
  goSignOut(){
    wx.clearStorage();

    wx.navigateTo({
      url: '/pages/login/login'
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