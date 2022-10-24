import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/* 
常量路由
包括登陆/404/首页
*/
export const constantRoutes = [
  //登录
  {
    path: '/login',
    name:'Login',
    component: () => import('@/views/login'),
    hidden: true
  },
  // 404页面
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
//首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard'),
      meta: { title: '首页', icon: 'dashboard' }
    },
  ]
  },

]

//异步路由
export const allAsyncRoutes = [
  //权限管理
  {
    path:'/jurisdiction',
    name:'Acl',
    component:Layout,
    meta:{
      title:'权限管理',
      icon:'el-icon-setting'
    },
    //重定向二级路由
    redirect:'/jurisdiction/user',
    children:[
      //用户管理
      {
        path:'user',
        name:'User',
        component:() => import('@/views/jurisdiction/user'),
        meta:{
          title:'用户管理',
          icon:'el-icon-user-solid'
        }
      },
      //角色管理
      {
        path:'role',
        name:'Role',
        component:()=> import('@/views/jurisdiction/role'),
        meta:{
          title:'角色管理',
          icon:'el-icon-s-check'
        }
      },
      //菜单管理
      {
        path:'menu',
        name:'Permission',
        component:()=>import('@/views/jurisdiction/menu'),
        meta:{
          title:'菜单管理',
          icon:'el-icon-menu'
        }
      },
    ]
  },

  //商品管理
    {
      path:'/sell',
      component:Layout,
      name:'Product',
      meta:{
        title:'商品管理',
        icon:'el-icon-s-shop',
      },
      redirect:'/sell/trademark',
      children:[
        // 分类管理
        {
          path:'class',
          component:() => import('@/views/sellerMan/classification'),
          name:'Class',
          meta:{
            title:'分类管理',
            icon:'el-icon-s-flag'
          }
        },
        // 品牌管理
        {
          path:'trademark',
          component:() => import('@/views/sellerMan/trademark'),
          name:'Trademark',
          meta:{
            title:'品牌管理',
            icon:'el-icon-s-claim'
          }
        },
        //平台属性管理
        {
          path:'attr',
          component:() => import('@/views/sellerMan/attr'),
          name:'Attr',
          meta:{
            title:'平台属性管理',
            icon:'el-icon-s-finance'
          }
        },
        //SPU管理
        {
          path:'spu',
          component:() => import('@/views/sellerMan/spu'),
          name:'Spu',
          meta:{
            title:'SPU管理',
            icon:'el-icon-s-order'
          }
        },
        // sku管理
        {
          path:'sku',
          component:() => import('@/views/sellerMan/spu'),
          name:'Sku',
          meta:{
            title:'SKU管理',
            icon:'el-icon-s-order'
          }
        },
      ]
    },
] 

//任意路由
export const anyRoute = { path: '*', redirect: '/404', hidden: true }