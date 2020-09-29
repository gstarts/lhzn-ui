import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listPlate(query) {
  return request({
    url: '/coal/plate/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getPlate(id) {
  return request({
    url: '/coal/plate/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addPlate(data) {
  return request({
    url: '/coal/plate',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updatePlate(data) {
  return request({
    url: '/coal/plate',
    method: 'put',
    data: data
  })
}

// 作废【小提煤单信息】
export function delPlate(id) {
  return request({
    url: '/coal/plate/' + id,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportPlate(query) {
  return request({
    url: '/coal/plate/export',
    method: 'get',
    params: query
  })
}