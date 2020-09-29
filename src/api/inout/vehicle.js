import request from '@/utils/request'

// 查询进出场查询列表
export function listVehicle(query) {
  return request({
    url: '/inout/inoutinfo/list',
    method: 'get',
    params: query
  })
}

// 查询进出场查询详细
export function getVehicle(sessionId) {
  return request({
    url: '/inout/vehicle/' + sessionId,
    method: 'get'
  })
}

// 新增进出场查询
export function addVehicle(data) {
  return request({
    url: '/inout/vehicle',
    method: 'post',
    data: data
  })
}

// 修改进出场查询
export function updateVehicle(data) {
  return request({
    url: '/inout/vehicle',
    method: 'put',
    data: data
  })
}

// 删除进出场查询
export function delVehicle(sessionId) {
  return request({
    url: '/inout/vehicle/' + sessionId,
    method: 'delete'
  })
}

// 导出进出场查询
export function exportVehicle(query) {
  return request({
    url: '/inout/vehicle/export',
    method: 'get',
    params: query
  })
}