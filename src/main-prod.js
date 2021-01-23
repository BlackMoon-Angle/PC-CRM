import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor' // 导入富文本编辑器

// import './plugins/element.js' // 引入element UI 组件库——利用CDN加载
import './assets/css/global.css' // 导入全局样式表
import './assets/fonts/iconfont.css' // 导入字体图标

// 进度条
import NProgress from 'nprogress'

// 设置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置axios请求拦截
// 做请求前,优先判断是否符合设定的条件来是否允许请求
axios.interceptors.request.use(config => {
  // 展示进度条
  NProgress.start()
  // 为请求头对象，添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
// 在 response 拦截器中，隐藏进度条——NProgress.done()
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

// 全局过滤器——格式化时间
Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear() // 年
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // 月
  const d = (dt.getDate() + '').padStart(2, '0') // 日
  const hh = (dt.getHours() + '').padStart(2, '0') // 时
  const mm = (dt.getMinutes() + '').padStart(2, '0') // 分
  const ss = (dt.getSeconds() + '').padStart(2, '0') // 秒
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
