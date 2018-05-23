// pages/help/help.js
import { store } from './store';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kf:{
      qq:"",
      mobile:"",
      wechat:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getKfInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getKfInfo(){
    store.getKfInfo({key:"kf"},(resp) => {
      if(resp.value){
        this.setData({
          kf:JSON.parse(resp.value)
        })
      }
    })
  },

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