import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element.js' // 引入element UI 组件库
import './assets/css/global.css' // 导入全局样式表
import './assets/fonts/iconfont.css' // 导入字体图标

// 设置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置axios请求拦截
// 做请求前,优先判断是否符合设定的条件来是否允许请求
axios.interceptors.request.use(config => {
  // 为请求头对象，添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
