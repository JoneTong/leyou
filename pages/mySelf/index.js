// pages/mySelf/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0,
    num: 0,
    name: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!wx.getStorageSync('openId') || !wx.getStorageSync('token')) {
      this.setData({
        isLogin: false
      })
    }else{
      this.setData({
        isLogin: true
      })
      this.fetchData()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(!wx.getStorageSync('openId') || !wx.getStorageSync('token')) {
      this.setData({
        isLogin: false
      })
    }else{
      this.setData({
        isLogin: true
      })
    }
    if(wx.getStorageSync('prePageLogin')) {
      this.fetchData()
      wx.setStorageSync('prePageLogin',false)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.fetchData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchData() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      url: '/index/getUserInfo',
      method:'get',
      success: function(res) {
        wx.hideLoading()
        that.setData({
          money: res.balance || 0,
          num: res.traceCount,
          name: res.member_name
        })
      },
      error: function(res) {
        wx.hideLoading()
      },
      fail: function(res) {
        wx.hideLoading()
      },

    })
  },
  loginTo() {
    wx.navigateTo({
      url: '../login/index?url=true',
    })
  },
  orderList() {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/index?url=true',
      })
    }else{
      wx.navigateTo({
        url: '../orderList/index',
      })
    }
  }
})