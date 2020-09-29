import request from '@/utils/request'

export function listData(query) {
  return request({
    url: '/enterprise/qualification/data/list',
    method: 'get',
    params: query
  })
}

// 查询企业资质管理列表
export function listQualification(query) {
  return request({
    url: '/enterprise/qualification/list',
    method: 'get',
    params: query
  })
}

// 查询企业资质管理详细
export function getQualification(id) {
  return request({
    url: '/enterprise/qualification/' + id,
    method: 'get'
  })
}

// 新增企业资质管理
export function addQualification(data) {
  return request({
    url: '/enterprise/qualification',
    method: 'post',
    data: data
  })
}

// 修改企业资质管理
export function updateQualification(data) {
  return request({
    url: '/enterprise/qualification',
    method: 'put',
    data: data
  })
}

// 删除企业资质管理
export function delQualification(id) {
  return request({
    url: '/enterprise/qualification/' + id,
    method: 'delete'
  })
}

// 导出企业资质管理
export function exportQualification(query) {
  return request({
    url: '/enterprise/qualification/export',
    method: 'get',
    params: query
  })
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: '/enterprise/qualification/importTemplate',
    method: 'get'
  })
}