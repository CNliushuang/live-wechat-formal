// pages/components/footer/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tab: {
      type: String,
      value: 'my',
    }
  },
 
  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    switchMy() {
      if (this.tab != 'my') {
        let url = '/pages/my/my';
        wx.navigateTo({
          url: url
        })
      }
    },
    switchAccount() {
      if (this.tab != 'account') {
        let url = '/pages/logs/logs';
        wx.navigateTo({
          url: url
        })
      }
    }
  }
})
