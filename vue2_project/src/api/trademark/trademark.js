import request from '@/utils/request'

//获取品牌列表数据的请求
export const reqTradeMarkList = (page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'GET'})

//添加和修改品牌的请求
export const reqAddOrUpdateTradeMark = (trademark) => {
    if(trademark.id){
        //修改操作
        return request({url:'/admin/product/baseTrademark/update',method:'PUT',data:trademark})
    }else{
        return request({url:'/admin/product/baseTrademark/save',method:'POST',data:trademark})
    }
}


//删除品牌的请求
export const reqDetetedTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
