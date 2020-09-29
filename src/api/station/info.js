import request from '@/utils/request'

// 查询场站的基本信息列表
export function listInfo() {
  return request({
    url: '/station/common/list',
    method: 'get',
  })
}

// 查询场站的基本信息详细
export function getInfo(id) {
  return request({
    url: '/station/common/' + id,
    method: 'get'
  })
}

// 新增场站的基本信息
export function addInfo(data) {
  return request({
    url: '/station/common',
    method: 'post',
    data: data
  })
}

// 修改场站的基本信息
export function updateInfo(data) {
  return request({
    url: '/station/common',
    method: 'put',
    data: data
  })
}

// 删除场站的基本信息
export function delInfo(id) {
  return request({
    url: '/common/info/' + id,
    method: 'delete'
  })
}

// 导出场站的基本信息
export function exportInfo(query) {
  return request({
    url: '/common/info/export',
    method: 'get',
    params: query
  })
}