import request from '@/utils/request'

// 查询进出场货物列表
export function listGoods(query) {
  return request({
    url: '/inout/goods/list',
    method: 'get',
    params: query
  })
}

// 查询进出场货物详细
export function getGoods(id) {
  return request({
    url: '/inout/goods/' + id,
    method: 'get'
  })
}

// 新增进出场货物
export function addGoods(data) {
  return request({
    url: '/inout/goods',
    method: 'post',
    data: data
  })
}

// 修改进出场货物
export function updateGoods(data) {
  return request({
    url: '/inout/goods',
    method: 'put',
    data: data
  })
}

// 删除进出场货物
export function delGoods(id) {
  return request({
    url: '/inout/goods/' + id,
    method: 'delete'
  })
}

// 导出进出场货物
export function exportGoods(query) {
  return request({
    url: '/inout/goods/export',
    method: 'get',
    params: query
  })
}
// 申请通过
export function consentApply(id){
  return request({
    url: '/inout/goods/consentApply/' + id,
    method: 'get'

})
}
// 撤销申请
export function cancellationApply(id){
  return request({
    url: '/inout/goods/cancellationApply/' + id,
    method: 'get'

})
}