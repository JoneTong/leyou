// pages/searchOrder/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_no: '',
    loading: false,
    stepsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  // 990000254533
  searchOrder(e) {
    let that = this
    this.setData({
      stepsList: [],
      loading: true,
      order_no: e.detail.value
    })
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      url: '/index/getTrace',
      data:{
        data: {
          order_no: e.detail.value
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
})