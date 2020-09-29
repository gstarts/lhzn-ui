import request from '@/utils/request'

// 查询仓库货物列表
export function listGoods(query) {
  return request({
    url: '/depot/goods/list',
    method: 'get',
    params: query
  })
}

// 查询仓库货物详细
export function getGoods(id) {
  return request({
    url: '/depot/goods/' + id,
    method: 'get'
  })
}

// 新增仓库货物
export function addGoods(data) {
  return request({
    url: '/depot/goods',
    method: 'post',
    data: data
  })
}

// 修改仓库货物
export function updateGoods(data) {
  return request({
    url: '/depot/goods',
    method: 'put',
    data: data
  })
}

// 删除仓库货物
export function delGoods(id) {
  return request({
    url: '/depot/goods/' + id,
    method: 'delete'
  })
}

// 导出仓库货物
export function exportGoods(query) {
  return request({
    url: '/depot/goods/export',
    method: 'get',
    params: query
  })
}

