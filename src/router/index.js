import Vue from 'vue'
import VueRouter from 'vue-router'
// 首页
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
// user区
// import User from '../components/user/User.vue'
const User = () => import(/* webpackChunkName: "user" */ '../components/user/User.vue')
// power区
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
const Rights = () => import(/* webpackChunkName: "power" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "power" */ '../components/power/Roles.vue')

// goods区
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import GoodsList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
const Cate = () => import(/* webpackChunkName: "goods" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "goods" */ '../components/goods/Params.vue')
const GoodsList = () => import(/* webpackChunkName: "goods" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "goods" */ '../components/goods/Add.vue')
// order区
// import Order from '../components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "order" */ '../components/order/Order.vue')
// report区
// import Report from '../components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' }, // 重定向，打开页面立刻转到login页
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/Welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
// to——将要访问的路径，from——从哪一个路径跳转而来，next——函数，表示通过
router.beforeEach((to, from, next) => {
  // 如果进入的是登录页，则无需拦截，直接通过
  if (to.path === '/login') return next()
  // 如果进入的不是登录页，则获取在 sessionStorage 中保存的 token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果 token 不存在，则拦截用户进入其他页，强行进入登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
