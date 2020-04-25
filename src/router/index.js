import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'
import Publish from '@/views/publish'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由 layout 有一个默认子路由，这个名字没有意义，所以警告
    // 正确的做法是：如果有默认子路由，就不要给父路由起名字了
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path 为空，会作为默认子路由渲染

        // 路由的名字是干啥的？
        // 参考：https://gitee.com/lipengzhou/toutiao-publish-admin/issues/I1F1BA
        name: 'home',
        component: Home
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login，校验登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过
  // 允许通过
  // next()

  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})
export default router
