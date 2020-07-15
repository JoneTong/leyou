// pages/receptAddress.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useAddress: [],
    pageNumber: 1,
    pageSize: 10,
    keywords: '',
    complete: false,
    searchStatus: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUseAddress('refresh')
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
    this.getUseAddress('refresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getUseAddress('bottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  searchAdrress(e) {
    this.setData({
      searchAdrress: true,
      complete: false,
      pageNumber: 1,
      keywords: e.detail.value
    })
    this.getUseAddress('refresh')
  },
  getUseAddress(type) {
    let that = this
    // 上滑加载
    if (type === 'reachBottom') {
      if (this.data.complete) {
        return;
      }
      this.setData({
        pageNumber: this.data.pageNumber++
      })
    }
    if(type == 'refresh') {
      this.setData({
        useAddess: []
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true
    })
    app.request({
      url: '/index/getAddress',
      data: {
        data: {
          pageSize: 10,
          pageNumber: 1,
          keywords: that.data.keywords
        }
      },
      success: function(res) {
        wx.hideLoading()
        if (res && !res.length && this.data.pageNumber != 1) {
          that.setData({
            complete: true
          })
        }
        that.setData({
          useAddess: res,
          loading: false
        })
        console.log(that.data.useAddess)
      },
      error: function(res) {
        wx.hideLoading()
        app.showModal(res.msg)
      },
      fail: function(res) {
        wx.hideLoading()
      }
    })
  }, 
  chooseAddress(e) {
    let index = e.currentTarget.dataset.index
    wx.setStorageSync('currentAddress',this.data.useAddess[index])
    wx.navigateBack({
      delta: 1,
    })
  },
})