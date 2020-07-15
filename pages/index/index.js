//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showSendInfo: false,
    showReceptInfo: false,
    formData: {
      order_no:"",
      insurance:"", //保费
      service_type:"标准件",//运单类型
      name:"",
      phone:"",
      address:"",
      idcard:"",//收件人身份证 不必填
      send_name:"",
      send_phone: wx.getStorageSync('phone') || '',
      send_address:"",
      trim:[]
    },
    initFormData: {},
    goods: [{
      product_name: '',
      product_brand: '',
      product_format: '',
      product_cnt: ''
    }],
    initGoods: [],
    sendRegion: [],
    receptRegion: [],
    orderType: ['标准件','经济件'],
    orderTepyVal: 0,
    announcedText:'最新通知最新通知最新通知最新通知最新通知最新通知最新通最新通知最新通知最新通知最新通知最新通知最新通知最新通最新通知最新通知最新通知最新通知最新通知最新通知最新通最新通知最新通知最新通知最新通知最新通知最新通知最新通最新通知最新通知最新通知最新通知最新通知最新通知最新通最新通知最新通知最新通知最新通知最新通知最新通知最新通最新通知最新通知最新通知最新通知最新通知最新通知最新通',
    useAddess: [],
    showModal: false,
    isLogin: false,
    tipsText: '',
    currentIndex: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    this.setData({
      initFormData: JSON.parse(JSON.stringify(this.data.formData)),
      initGoods: JSON.parse(JSON.stringify(this.data.goods))
    })
  },
  onShow() {
    if(!wx.getStorageSync('openId') || !wx.getStorageSync('token')) {
      this.setData({
        isLogin: false
      })
    }else{
      this.setData({
        isLogin: true
      })
      this.getUseAddress()
    }
  },
  showSendForm() {
    let _this = this
    this.setData({
      showSendInfo: !_this.data.showSendInfo
    })
  },
  showReceptForm() {
    let _this = this
    this.setData({
      showReceptInfo: !_this.data.showReceptInfo
    })
  },

  bindSendRegionChange(e) {
    this.setData({
      sendRegion: e.detail.value
    })
  },
  bindReceptRegionChange(e) {
    this.setData({
      receptRegion: e.detail.value
    })
  },

  getAddressData() {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/index?url=true'
      })
      return
    }
    wx.navigateTo({
      url: '../receptAddress/index'
    })
  },

  getUseAddress() {console.log(wx.getStorageSync('phone'))
    if(wx.getStorageSync('phone')) {
      this.setData({
        'formData.send_phone':  wx.getStorageSync('phone'),
      })
    }
    if(wx.getStorageSync('currentAddress')) {
      this.setData({
        'formData.name':  wx.getStorageSync('currentAddress').name,
        'formData.phone':  wx.getStorageSync('currentAddress').phone,
        'formData.address':  wx.getStorageSync('currentAddress').address,
      })
    }
    
  }, 
  
  bindPickerChange(e) {
    this.setData({
      orderTepyVal: e.detail.value,
      'formData.service_type': this.data.orderType[e.detail.value]
    })
  },
  viewAnnounce() {
    if(this.data.announcedText.length>60) {
      wx.navigateTo({
        url: '../ammounce/index',
      })  
    }
  },
  addGoods() {
    let goodsInfo = {
      product_name: '',
      product_brand: '',
      product_format: '',
      product_cnt: ''
    }
    this.setData({
      'goods': this.data.goods.concat(goodsInfo)
    })
  },
  cutGoods(e) {
    const newGoods = this.data.goods
    newGoods.splice(e.currentTarget.dataset.index,1)
    this.setData({
      goods: newGoods
    })
  },
  goodsChange(e) {
    const value = e.detail.value
    const index = e.currentTarget.dataset.index
    const nam = e.currentTarget.dataset.nam
    const goods = this.data.goods
    console.log(value,index,nam,this.data.goods)
    goods[index][nam] = value
    this.setData({
      goods: goods
    })
  },
  setFormDataInfo(e) {
    let lab = e.currentTarget.dataset.nam
    let value = e.detail.value
    let formInfo = this.data.formData
    formInfo[lab] = value
    this.setData({
      formData: formInfo
    })
  },
  confirmData() {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/index?url=true',
      })
      return
    }
    this.setData({
      'formData.trim': this.data.goods
    })
    for(let k in this.data.formData) {
      if( ['send_phone','name','phone','address','order_no','insurance'].includes(k) && !this.data.formData[k]) {
        app.showModal(this.checkForm(k)+'不能为空')
        return
      }
    }
    for(let k in this.data.formData.trim) {
      for(let kd in this.data.formData.trim[k]) {
        if(!this.data.formData.trim[k][kd]) {
          app.showModal('内件'+this.data.formData.trim[k].product_name+this.checkForm(kd)+'不能为空')
          return
        }
      }
    }
    this.setData({
      showModal: true
    })
  },
  cancelModal(e) {
    this.setData({
      showModal: false,
      showAddressModal: false
    })
  },
  
  submitOrder() {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/index?url=true',
      })
      return
    }
    const that = this
    // return
    app.request({
      url: '/index/addLogisticsInfo',
      data: {
        data: this.data.formData
      },
      success: function(res){
        app.showModal('物流添加成功')
        that.setData({
          formData: that.data.initFormData,
          goods: that.data.initGoods,
          'formData.name':  wx.getStorageSync('currentAddress').name || '',
          'formData.phone':  wx.getStorageSync('currentAddress').phone || '',
          'formData.address':  wx.getStorageSync('currentAddress').address || '',
          'formData.send_phone':  wx.getStorageSync('phone') || '',
          showModal: false
        })
      },
      error: function(res) {

      },
      fail: function(res) {
        
      }
    })
  },
  checkForm(type) {
    if(type == 'send_phone') {
      this.setData({
        tipsText: '寄件电话'
      })
      return this.data.tipsText
    }else if(type == 'name') {
      this.setData({
        tipsText: '收件人姓名'
      })
    }else if(type == 'phone') {
      this.setData({
        tipsText: '收件人电话'
      })
    }else if(type == 'address') {
      this.setData({
        tipsText: '收件人地址'
      })
    }else if(type == 'order_no') {
      this.setData({
        tipsText: '快递单号'
      })
    }else if(type == 'insurance') {
      this.setData({
        tipsText: '保费'
      })
    }else if(type == 'product_name') {
      this.setData({
        tipsText: '名称'
      })
    }else if(type == 'product_brand') {
      this.setData({
        tipsText: '品牌'
      })
    }else if(type == 'product_format') {
      this.setData({
        tipsText: '规格'
      })
    }else if(type == 'product_cnt') {
      this.setData({
        tipsText: '数量'
      })
    }
    return this.data.tipsText
  }
})
