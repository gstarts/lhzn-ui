import request from '@/utils/request'

// 查询集装箱管理Head列表
export function listContainer(query) {
  return request({
    url: '/container/list',
    method: 'get',
    params: query
  })
}

// 查询集装箱管理Head详细
export function getContainer(id) {
  return request({
    url: '/container/' + id,
    method: 'get'
  })
}

// 新增集装箱管理Head
export function addContainer(data) {
  return request({
    url: '/container/',
    method: 'post',
    data: data
  })
}

// 修改集装箱管理Head
export function updateContainer(data) {
  return request({
    url: '/container',
    method: 'put',
    data: data
  })
}

// 删除集装箱管理Head
export function delContainer(id) {
  return request({
    url: '/container/' + id,
    method: 'delete'
  })
}

// 导出集装箱管理Head
export function exportContainer(query) {
  return request({
    url: '/container/export',
    method: 'get',
    params: query
  })
}

