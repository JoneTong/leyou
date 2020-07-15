//app.js
App({
  config: {
    serverUrl: 'http://www.leuex.com/wechat',
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  login(){
    let that = this
    wx.login({
      success:function(res){
        that.globalData.openId = res.code
        wx.setStorageSync('openId', res.code)
        console.log(1,res)
        //发送请求
        wx.request({
          url: 'test.php', //接口地址
          data: {code:res.code},
          header: {
            'content-type': 'application/json' //默认值
          },
          success: function (res) {
            console.log(res.data)
          }
        })
      }
    })
  },
  request: function(param) {
    const that = this;
    const path = param.url ? param.url : '';
    let url = this.config.serverUrl + param.url;
    let data = param.data || {};
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json',
        token: wx.getStorageSync('token') || ''
      },
      method: param.method || 'post',
      dataType: 'json',
      success: function(res) {
        if(res.data.code == 1) {
          // wx.showModal({
          //   showCancel: false,
          //   content: res.data.msg,
          // })
          typeof param.success === 'function' && param.success(res.data.data);
        }else{
          if(res.data.code == 10010) {
            wx.removeStorageSync('openId')
            wx.removeStorageSync('userInfo')
            wx.removeStorageSync('token')
            wx.showToast({
              title: '未登录，请重新登录',
            })
            wx.navigateTo({
              url: '../login/index',
            });
            return;
          }
          wx.showModal({
            showCancel: false,
            content: res.data.msg,
          })
          typeof param.error === 'function' && param.error(res.data.data);
        }
      },
      fail: function(res) {
        typeof param.fail === 'function' && param.fail(res);
      },
      complete: function() {
        typeof param.complete === 'function' && param.complete();
      }
    })
  },
  /**
   * 打印error日志
   */
  errorLog: function(msg) {
    console.log('[error]:' + msg);
  },

  /**
   * 打印fail日志
   */
  failLog: function(msg) {
    console.log('[fail]:' + msg);
  },
  /**
   * 提示消息
   */
  showModal: function(content) {
    wx.showModal({
      title: '提示消息',
      content: content,
      showCancel: false,
      confirmColor: '#1CA3FA'
    });
  },
  globalData: {
    userInfo: null,
    openId: '',
    prePageLogin: false,
    currentIndex: null
  }
})