// pages/orderDetail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: '',
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
    if(!wx.getStorageSync('openId') || !wx.getStorageSync('token')) {
      this.setData({
        isLogin: false
      })
    }else{
      this.setData({
        isLogin: true
      })
      this.stepsData()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      loading: true
    })
    if(!wx.getStorageSync('openId') && !wx.getStorageSync('token')) {
      this.setData({
        isLogin: false,
      })
    }else{
      this.setData({
        isLogin: true
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.stepsData()
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
          stepsList: res,
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
  loginTo() {
    wx.navigateTo({
      url: '../login/index?url=true',
    })
  }
})