import request from '@/utils/request'

// 查询集装箱体列表
export function listBody(query) {
  return request({
    url: '/container/info/body/list',
    method: 'get',
    params: query
  })
}

// 查询集装箱体详细
export function getBody(id) {
  return request({
    url: '/container/info/body/' + id,
    method: 'get'
  })
}

// 新增集装箱体
export function addBody(data) {
  return request({
    url: '/container/info/body',
    method: 'post',
    data: data
  })
}

// 修改集装箱体
export function updateBody(data) {
  return request({
    url: '/container/info/body',
    method: 'put',
    data: data
  })
}

// 删除集装箱体
export function delBody(id) {
  return request({
    url: '/container/info/body/' + id,
    method: 'delete'
  })
}

// 导出集装箱体
export function exportBody(query) {
  return request({
    url: '/container/info/body/export',
    method: 'get',
    params: query
  })
}

// 初始化页面方法
export function init(){
  return request({
    url: '/container/info/init' ,
    method: 'get',
  })
}

// 下载导入模板
export function importTemplate() {
  return request({
    url: '/container/info/body/importTemplate',
    method: 'get'
  })
}



