/* pages/login/login.js */ 
var app = getApp() //获取应用实例 
Page({ 
  data: { 
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。 
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    loading: true,
    urlVal: false
   }, 
   onLoad: function (options) {
    this.setData({
      urlVal: options.url
    })
    wx.login({
      success:function(res){
        app.globalData.openId = res.code
        wx.setStorageSync('openId', res.code)
      }
    }) 
   },
   onShow() {
     
     wx.showLoading({
       title: '正在进入程序',
     })
     this.setData({
      loading: true
     })
    if(wx.getStorageSync('openId') && wx.getStorageSync('token')) {
      wx.hideLoading()
      wx.switchTab({
        url: '../index/index',
      })
      this.setData({
        loading: false
       })
    }else{
      wx.hideLoading()
      wx.removeStorageSync('openId')
      wx.removeStorageSync('userInfo')
      wx.removeStorageSync('token')
      wx.removeStorageSync('phone')
      this.setData({
        loading: false
      })
    }
   }, 
    getPhoneNumber: function(e) {
      let that = this
      wx.showLoading({
        title: '登录中',
      })
      if(e.detail.errMsg == "getPhoneNumber:ok") {
        console.log(e)
        var encryptedData = e.detail.encryptedData
        var iv = e.detail.iv
        app.globalData.userInfo = e.detail.encryptedData
        app.globalData.prePageLogin = true
        wx.setStorageSync('prePageLogin',true)
        wx.setStorageSync('userInfo', e.detail.encryptedData)
        //发送请求
        app.request({
          url: '/login/doWachatLogin', //接口地址
          data: {
            data:{
              js_code: wx.getStorageSync('openId'),
              encryptedData: encryptedData,
              iv: iv
            }
          },
          success: function (res) {
            wx.hideLoading()
            wx.setStorageSync('token', res.token)
            wx.setStorageSync('phone', res.wx_mobile)
            //最后，返回返回刚才的界面
            if(that.data.urlVal) {
              // console.log('back')
              wx.navigateBack({ delta: 1 }) 
            }else{
              // console.log('switchTab')
              wx.switchTab({
                url: '../index/index',
              })
            }  
          }
        })
      }else{
        wx.hideLoading()
        if(that.data.urlVal) {
          wx.navigateBack({ delta: 1 }) 
        }else{
          wx.switchTab({
            url: '../index/index',
          })
        }
        return
      }
    }
  }) 