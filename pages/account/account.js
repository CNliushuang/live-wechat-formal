// pages/account/account.js
import { store } from './store';
const app = getApp();

import { dateToTimes } from '../../utils/util'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cash_list: [],
    account_list: [],
    time_list:[],
    tab:"cash",
    limit:50,
    start:"",
    end:""
  },
  switchTab(event){
    let tab = event.target.dataset.tab;
    console.log(tab);


    if(tab){
      this.setData({
        tab:tab
      })
      this.getList();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();

  },
  bindChangeStart: function (e) {
    this.setData({
      start: e.detail.value
    })
    this.getList();
  },
  bindChangeEnd: function (e) {
    this.setData({
      end: e.detail.value
    })
    this.getList();
  },
  getList(startNum){
    let start = startNum || 0;
    let filter = {};
    if(this.data.start){
      var startDate = dateToTimes(this.data.start + ' 00:00:00');
      filter.startDate = startDate;
    }
    if (this.data.end) {
      var endDate = dateToTimes(this.data.end + ' 23:59:59');
      filter.endDate = endDate;
    }

    console.log(start)
    console.log(this.data.limit)
    console.log(filter)

    if(this.data.tab == 'cash'){
      store.getCashList({ start, limit: this.data.limit, filter},(resp) => {
        console.log('cash list')
        console.log(resp)
        this.setData({
          cash_list:resp.list
        })
      })
    }else if(this.data.tab == 'time'){
      store.getTimeList({ start, limit: this.data.limit, filter }, (resp) => {
        console.log('time list')
        console.log(resp)
        this.setData({
          time_list: resp.list
        })
      })
    }else if(this.data.tab == 'account'){
      store.getAccountList({ start, limit: this.data.limit, filter }, (resp) => {
        console.log('account list')
        console.log(resp)
      
        this.setData({
          account_list: resp.list
        })
      })
    }
  },
  upper(){

  },
  lower(){

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