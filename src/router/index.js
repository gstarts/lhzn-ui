import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: '统计分析',
        meta: { title: '统计分析', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/bind',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'details',
        component: () => import('@/views/waybill/bind/detailTable'),
        name: 'BindDetail',
        meta: { title: '核放单详情' }
      },
      {
        path: 'edit',
        component: () => import('@/views/waybill/bind/addTable'),
        name: 'BindEdit',
        meta: { title: '核放单修改' }
      }
    ]
  },
  //  提煤单路由
  {
    path: '/coallist',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'details',
        component: () => import('@/views/coal/addCoal/detail'),
        name: 'CoalDetail',
        meta: { title: '提煤单详情' }
      },
      {
        path: 'edit',
        component: () => import('@/views/coal/addCoal/index'),
        name: 'CoalEdit',
        meta: { title: '提煤单修改'}
      }
    ]
  },
  //  集装箱路由
  {
    path: '/contList',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'details',
        component: (resolve) => require(['@/views/coal/addCoal/detail'], resolve),
        name: 'ContDetail',
        meta: { title: '集装箱详情' }
      },
      {
        path: 'edit',
        component: (resolve) => require(['@/views/container/container/index'], resolve),
        name: 'ContEdit',
        meta: { title: '集装箱修改'}
      }
    ]
  },
  //  确报路由
  {
    path: '/approve',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'details',
        component: () => import('@/views/rmft/head4406/details'),
        name: 'approveDetail',
        meta: { title: '确报信息详情' }
      },
      {
        path: 'edit',
        component: () => import('@/views/rmft/update4406/updateindex'),
        name: 'approveEdit',
        meta: { title: '确报信息修改'}
      }
    ]
  },
  //空车路由
  {
    path: '/emptyCar',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'Erredit',
        component: () => import('@/views/rmft/update4404/updateIndex'),
        name: 'errUpdate',
        meta: { title: '空车异常信息修改'}
      },
      {
        path: 'seledetails',
        component: () => import('@/views/rmft/head4404/details'),
        name: 'carUpdate',
        meta: { title: '空车信息详情'}
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  }
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
