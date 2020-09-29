import request from '@/utils/request'

// 查询集装箱头列表
export function listInfo(query) {
  return request({
    url: '/container/info/head/list',
    method: 'get',
    params: query
  })
}

// 查询集装箱头详细
export function getInfo(id) {
  return request({
    url: '/container/info/head/' + id,
    method: 'get'
  })
}

// 新增集装箱头
export function addInfo(data) {
  return request({
    url: '/container/info/head',
    method: 'post',
    data: data
  })
}

// 修改集装箱头
export function updateInfo(data) {
  return request({
    url: '/container/info/head',
    method: 'put',
    data: data
  })
}

// 删除集装箱头
export function delInfo(id) {
  return request({
    url: '/container/info/head/' + id,
    method: 'delete'
  })
}

// 导出集装箱头
export function exportInfo(query) {
  return request({
    url: '/container/info/head/export',
    method: 'get',
    params: query
  })
}

