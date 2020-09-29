import request from '@/utils/request'

// 查询皮带秤列表
export function listBeltscale(query) {
  return request({
    url: '/beltscale/beltscale/list',
    method: 'get',
    params: query
  })
}

// 查询皮带秤详细
export function getBeltscale(id) {
  return request({
    url: '/beltscale/beltscale/' + id,
    method: 'get'
  })
}

// 新增皮带秤
export function addBeltscale(data) {
  return request({
    url: '/beltscale/beltscale',
    method: 'post',
    data: data
  })
}

// 修改皮带秤
export function updateBeltscale(data) {
  return request({
    url: '/beltscale/beltscale',
    method: 'put',
    data: data
  })
}

// 删除皮带秤
export function delBeltscale(id) {
  return request({
    url: '/beltscale/beltscale/' + id,
    method: 'delete'
  })
}

// 导出皮带秤
export function exportBeltscale(query) {
  return request({
    url: '/beltscale/beltscale/export',
    method: 'get',
    params: query
  })
}