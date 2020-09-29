import request from '@/utils/request'

// 查询场站配置
export function listConfig(query) {
  return request({
    url: '/enterprise/config/list',
    method: 'get',
    params: query
  })
}

// 查询场站功能详细(id筛选)
export function getConfig(id) {
  return request({
    url: '/enterprise/config/' + id,
    method: 'get'
  })
}

// 新增场站配置
export function addConfig(data) {
  return request({
    url: '/enterprise/config',
    method: 'post',
    data: data
  })
}

//修改自动申报
export function updateConfigDeclare(id,isDeclare) {
  const data ={
    id,isDeclare
  }
  return request({
    url: '/enterprise/config',
    method: 'put',
    data: data
  })
}

// 修改自动录入
export function updateConfigEntry(id,isEntry) {
  const data ={
    id,isEntry
  }
  return request({
    url: '/enterprise/config',
    method: 'put',
    data: data
  })
}

//修改散杂货自动申报
export function updateConfigDeclareGoods(id,isDeclareGoods) {
  const data ={
    id,isDeclareGoods
  }
  return request({
    url: '/enterprise/config',
    method: 'put',
    data: data
  })
}

// 删除场站配置
export function delConfig(id) {
  return request({
    url: '/enterprise/config/' + id,
    method: 'delete'
  })
}

// 导出场站配置
export function exportConfig(query) {
  return request({
    url: '/enterprise/config/export',
    method: 'get',
    params: query
  })
}