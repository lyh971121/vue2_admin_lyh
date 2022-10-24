import request from '@/utils/request'

//获取管理用户列表
export const reqUserList = (page,limit,searchObj) => request({url:`/admin/acl/user/${page}/${limit}`,method:'GET',
params: searchObj})

//添加用户
// export const reqAddUser = (user) => request({url:'/admin/acl/user/save',data:user,method:'post'})


//添加或修改用户
export const reqAddOrUpdateUser = (user) => {
    if(user.id){
        //修改操作
        return request({url:'/admin/acl/user/update',data:user,method:'put'})
    }else{
        return request({url:'/admin/acl/user/save',data:user,method:'post'})
    }
}

//删除
export const reqRemove = (id) => request({url:`/admin/acl/user/remove/${id}`,method:'delete'})
//搜索
export const reqSearch = (id) => request({url:`/admin/acl/user/get/${id}`,method:'get'})

//批量删除
export const reqAllRemove = (ids) =>request({url:'/admin/acl/user/batchRemove',data:ids,method:'delete'})

//获取用户角色
export const reqRoles = (userId) => request({usrl:`/admin/acl/user/toAssign/${userId}`,method:'get'})