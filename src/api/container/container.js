import request from '@/utils/request'

// 查询集装箱管理Head列表
export function listContainer(query) {
  return request({
    url: '/container/container/list',
    method: 'get',
    params: query
  })
}

// 查询集装箱管理Head详细
export function getContainer(id) {
  return request({
    url: '/container/container/' + id,
    method: 'get'
  })
}

// 新增集装箱管理Head
export function addContainer(data) {
  return request({
    url: '/container/container',
    method: 'post',
    data: data
  })
}

// 修改集装箱管理Head
export function updateContainer(data) {
  return request({
    url: '/container/container',
    method: 'put',
    data: data
  })
}

// 删除集装箱管理Head
export function delContainer(id) {
  return request({
    url: '/container/container/' + id,
    method: 'delete'
  })
}

// 导出集装箱管理Head
export function exportContainer(query) {
  return request({
    url: '/container/container/export',
    method: 'get',
    params: query
  })
}

// 集装箱信息
export function getdelContainerInfo( id ){
  return request({
    url: '/container/container/info/' + id,
    method: 'get',
  })
}

// 集装箱信息
export function getdelContainerInfoBody( id ){
  return request({
    url: '/container/container/infoBody/' + id,
    method: 'get',
  })
}

// 初始化页面方法
export function init(){
  return request({
    url: '/container/container/init',
    method: 'get',
  })
}

// 新增提运单表头
export function addBody(data) {
  return request({
    url: '/container/container/body',
    method: 'post',
    data: data
  })
}

// 修改提运单表体信息
export function updateBody(data) {
  return request({
    url: '/container/container/body',
    method: 'put',
    data: data
  })
}

// 查询体详细
export function getBody(id) {
  return request({
    url: '/container/container/body/' + id,
    method: 'get'
  })
}
