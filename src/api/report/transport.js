import request from '@/utils/request'

// 查询运输工具信息 列表
export function listTransport(query) {
  return request({
    url: '/report/transport/list',
    method: 'get',
    params: query
  })
}

// 查询异常车辆信息
export function selectErr(query) {
  return request({
    url: '/report/transport/Err',
    method: 'get',
    params:query
  })
}

// 查询运输工具信息 详细
export function getTransport(pId) {
  return request({
    url: '/report/transport/' + pId,
    method: 'get'
  })
}

// 新增运输工具信息 
export function addTransport(data) {
  return request({
    url: '/report/transport',
    method: 'post',
    data: data
  })
}

// 修改运输工具信息 
export function updateTransport(data) {
  return request({
    url: '/report/transport',
    method: 'put',
    data: data
  })
}

// 删除运输工具信息 
export function delTransport(pId) {
  return request({
    url: '/report/transport/' + pId,
    method: 'delete'
  })
}

// 导出运输工具信息 
export function exportTransport(query) {
  return request({
    url: '/report/transport/export',
    method: 'get',
    params: query
  })
}