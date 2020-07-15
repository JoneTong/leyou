// pages/orderList/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    pageSize: 10,
    pageNumber: 1,
    order_no: '',
    loading: false,
    complete: false,
    searchStatus: false,
    isLogin: false,
    tab: 'send'
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
        isLogin: true,
      })
      if(this.data.tab == 'send') {
        this.fetchData('refresh')
      }else{
        this.receptData('refresh')
      }
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
      this.fetchData('refresh')
      wx.setStorageSync('prePageLogin',false)
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
    this.setData({
      complete: false,
      pageNumber: 1,
      searchStatus: false
    }) 
    if(this.data.tab == 'send') {
      this.fetchData('refresh')
    }else{
      this.receptData('refresh')
    }
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.fetchData('reachBottom')
    if(this.data.tab == 'send') {
      this.fetchData('reachBottom')
    }else{
      this.receptData('reachBottom')
    }
  },
  fetchData(type) {
    if(this.data.loading) {
      return
    }
    this.setData({
      tab: 'send'
    })
    if(type === 'refresh') {
      this.setData({
        orderList: []
      })
    }
    // 上滑加载
    if (type === 'reachBottom') {
      if (this.data.complete) {
        return;
      }
      this.setData({
        pageNumber: this.data.pageNumber++
      })
      console.log('reachBottom',this.data.pageNumber++)
    }

    this.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    let data = {
      pageSize: this.data.pageSize,
      pageNumber: this.data.pageNumber,
      order_no: this.data.order_no
    }
    app.request({
      url: '/index/index',
      data: {
        data: data
      },
      success: function(res) {
        wx.hideLoading()
        if (res.rows && !res.rows.length && this.data.pageNumber != 1) {
          that.setData({
            complete: true
          })
        }
        that.setData({
          orderList: that.data.orderList.concat(res.rows),
          loading: false
        })
      },
      error: function(res) {
        app.errorLog(res);
        wx.hideLoading()
        this.setData({
          loading: false
        })
        app.showModal(res);
      },
      fail: function(res) {
        wx.hideLoading()
        app.failLog(res);
        this.setData({
          loading: false
        })
        app.showModal('网络错误，请稍候再试');
      }
    })
  },
  receptData(type) {
    if(this.data.loading) {
      return
    }
    this.setData({
      tab: 'recept'
    })
    if(type === 'refresh') {
      this.setData({
        orderList: []
      })
    }
    // 上滑加载
    if (type === 'reachBottom') {
      if (this.data.complete) {
        return;
      }
      this.setData({
        pageNumber: this.data.pageNumber++
      })
      console.log('reachBottom',this.data.pageNumber++)
    }

    this.setData({
      loading: true
    })
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    let data = {
      pageSize: this.data.pageSize,
        pageNumber: this.data.pageNumber,
        order_no: this.data.order_no
    }
    app.request({
      url: '/index/indexReceiving',
      data: {
        data: data
      },
      success: function(res) {
        wx.hideLoading()
        if (res.rows && !res.rows.length && this.data.pageNumber != 1) {
          that.setData({
            complete: true
          })
        }
        that.setData({
          orderList: that.data.orderList.concat(res.rows),
          loading: false
        })
      },
      error: function(res) {
        app.errorLog(res);
        wx.hideLoading()
        this.setData({
          loading: false
        })
        app.showModal(res);
      },
      fail: function(res) {
        wx.hideLoading()
        app.failLog(res);
        this.setData({
          loading: false
        })
        app.showModal('网络错误，请稍候再试');
      }
    })
  },
  tabChange(e) {
    if(this.data.loading) {
      return
    }
    this.setData({
      tab: e.currentTarget.dataset.tab,
      orderList: [],
      pageNumber: 1,
      complete: false
    })
    if(e.currentTarget.dataset.tab == 'send') {
      this.fetchData('refresh')
    }else{
      this.receptData('refresh')
    }
  },
  call: function(e) {
    const phone = e.currentTarget.dataset.phone;
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone
    });
  },
  orderDetail(e) {
    wx.navigateTo({
      url: '../orderDetail/index?num='+e.currentTarget.dataset.num
    })
  },
  stepsDetail(e) {
    wx.navigateTo({
      url: '../stepsDetail/index?num='+e.currentTarget.dataset.num
    })
  },
  searchOrder(e) {
    this.setData({
      order_no: e.detail.value,
      pageNumber: 1,
      searchStatus: true
    })
    if(this.data.tab == 'send'){
      this.fetchData('refresh')
    }else{
      this.receptData('refresh')
    }  
  },
  loginTo() {
    wx.navigateTo({
      url: '../login/index?url=true',
    })
  }
})