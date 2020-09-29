import request from '@/utils/request'

// 查询企业信息备案列表
export function listRecord(query) {
  return request({
    url: '/enterprise/record/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息备案详细
export function getRecord(id) {
  return request({
    url: '/enterprise/record/' + id,
    method: 'get'
  })
}

// 新增企业信息备案
export function addRecord(data) {
  return request({
    url: '/enterprise/record',
    method: 'post',
    data: data
  })
}

// 修改企业信息备案
export function updateRecord(data) {
  return request({
    url: '/enterprise/record',
    method: 'put',
    data: data
  })
}

// 删除企业信息备案
export function delRecord(id) {
  return request({
    url: '/enterprise/record/' + id,
    method: 'delete'
  })
}

// 导出企业信息备案
export function exportRecord(query) {
  return request({
    url: '/enterprise/record/export',
    method: 'get',
    params: query
  })
}