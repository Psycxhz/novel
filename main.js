
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'

uni.$http = $http
//http://localhost:8081/content/chapter/
$http.baseUrl = 'http://api.zhuishushenqi.com'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}


$http.afterRequest = function () {
  uni.hideLoading()
}

uni.$showMsg = function(title='数据请求失败',duration = 1500,icon = 'none'){
	uni.showToast({
		title,
		duration,
		icon
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif