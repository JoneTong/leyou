// pages/orderDetail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: '',
    orderDetail: {},
    stepsList: [],
    isLogin: false,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      num: options.num,
    })
    this.fetchData()
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
    if(!wx.getStorageSync('openId') && !wx.getStorageSync('token')) {
      this.setData({
        isLogin: false
      })
    }else{
      this.setData({
        isLogin: true
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

  },
  fetchData() {
    let that = this
    this.setData({
      orderDetail: {},
      loading: true
    })
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      url: '/index/getDetail',
      data:{
        data: {
          order_no: this.data.num
        }
      },
      success: function(res) {
        wx.hideLoading()
        that.setData({
          orderDetail: res,
          loading: false
        })
      },
      error: function(res) {
        wx.hideLoading()
        app.errorLog(res);
      },
      fail: function(res) {
        wx.hideLoading()
        app.errorLog(res);
      }
    })
  },
  stepsData() {
    let that = this
    this.setData({
      stepsList: []
    })
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      url: '/index/getTrace',
      data:{
        data: {
          order_no: this.data.num
        }
      },
      success: function(res) {
        wx.hideLoading()
        that.setData({
          stepsList: res
        })
      },
      error: function(res) {
        wx.hideLoading()
        app.errorLog(res);
      },
      fail: function(res) {
        wx.hideLoading()
        app.errorLog(res);
      }
    })
  },
  loginTo() {
    wx.navigateTo({
      url: '../login/index?url=true',
    })
  }
})