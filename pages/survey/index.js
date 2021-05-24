Component({
  data: {
    activeTab: 0,
    triggered: false,
  },
  methods:{
    //下拉刷新
    onRefresh() {
      if (this._freshing) return
      this._freshing = true
      setTimeout(() => {
        this.setData({
          triggered: false,
        })
        this._freshing = false
      }, 3000)
    },
    onPulling(e) {
      console.log('onPulling:', e)
    },
    onRestore(e) {
      console.log('onRestore:', e)
    },
  
    onAbort(e) {
      console.log('onAbort', e)
    },
    //下拉刷新
    onChange(event) {
      this.setData({
        activeTab: event.detail.name,
      });
      console.log('onChange');
    }
    
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    }
  }
})