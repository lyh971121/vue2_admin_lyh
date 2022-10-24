import { login as loginAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {constantRoutes,allAsyncRoutes,anyRoute} from '@/router/routes'
//按需引入深拷贝
import _ from 'lodash'
import router, { resetRouter } from '@/router/index'

//路由筛选 计算当前需要动态追加的路由结果
//第一个参数是所有的路由表信息  第二个参数是服务器返回的携带的路由信息
function findUserAsyncRouters (allAsyncRoutes,routerName){
  //过滤出用户需要动态的异步路由
  return allAsyncRoutes.filter(item => {
    if(routerName.indexOf(item.name) != -1){
      //接着过滤二级路由
      if(item.children && item.children.length > 0){
        item.children = findUserAsyncRouters(item.children,routerName)
      }
      return true
    }
  })
}




const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',

    roles: [],
    buttons: [],
    routes: [], // 本用户所有的路由,包括了固定的路由和下面的addRouters
    asyncRoutes: [] // 本用户的角色赋予的新增的动态路由
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER: (state, userInfo) => {
    state.name = userInfo.name // 用户名
    state.avatar = userInfo.avatar // 头像
    state.roles = userInfo.roles // 角色列表
    state.buttons = userInfo.buttons // 按钮权限列表
  },

  SET_TOKEN (state, token) {
    state.token = token
  },

  RESET_USER (state) {
    Object.assign(state, getDefaultState())
  },

  //追加动态路由
  SET_ROUTES:(state,asyncRoutes) =>{
    //保存异步路由
    state.asyncRoutes = asyncRoutes
    //合并路由 常量路由+动态路由+任意路由
    state.routes = [...constantRoutes,...asyncRoutes,anyRoute]
    //将当前用户的异步权限路由 和任意路由添加到路由器
    router.addRoutes([...asyncRoutes,anyRoute])
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      loginAPI.login(username, password)
        .then(result => {
          const { data } = result
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  },

  // 获取用户信息
  async getInfo ({ commit, state }) {
    const { data } = await loginAPI.getInfo()
    console.log(data);
    commit('SET_USER', data)
    //过滤出当前用户的路由
    commit('SET_ROUTES',findUserAsyncRouters(_.cloneDeep(allAsyncRoutes),data.routes))
  },

  /* 
  重置用户信息
  */
  async resetUser ({ commit, state }) {
    // 如果当前是登陆的, 请求退出登陆
    if (state.name) {
      await loginAPI.logout()
    }
    resetRouter()
    // 删除local中保存的token
    removeToken()
    // 提交重置用户信息的mutation
    commit('RESET_USER')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}