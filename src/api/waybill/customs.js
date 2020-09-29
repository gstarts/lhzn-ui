import request from '@/utils/request'

// 查询通关单列表
export function listCustoms(query) {
  return request({
    url: '/waybill/customs/list',
    method: 'get',
    params: query
  })
}

// 查询通关单详细
export function getCustoms(id) {
  return request({
    url: '/waybill/customs/' + id,
    method: 'get'
  })
}

// 新增通关单
export function addCustoms(data) {
  return request({
    url: '/waybill/customs',
    method: 'post',
    data: data
  })
}

// 修改通关单
export function updateCustoms(data) {
  return request({
    url: '/waybill/customs',
    method: 'put',
    data: data
  })
}

// 删除通关单
export function delCustoms(id) {
  return request({
    url: '/waybill/customs/' + id,
    method: 'delete'
  })
}

// 导出通关单
export function exportCustoms(query) {
  return request({
    url: '/waybill/customs/export',
    method: 'get',
    params: query
  })
}

  // 下载导入模板
  export function importTemplate() {
    return request({
      url: '/waybill/customs/importTemplate',
      method: 'get'
    })
  }