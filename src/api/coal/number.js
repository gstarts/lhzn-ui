import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listNumber(query) {
  return request({
    url: '/coal/number/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getNumber(coalNumber) {
  return request({
    url: '/coal/number/' + coalNumber,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addNumber(data) {
  return request({
    url: '/coal/number',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateNumber(data) {
  return request({
    url: '/coal/number',
    method: 'put',
    data: data
  })
}

// 作废【大提煤单信息作废】
export function delNumber(coalNumber) {
  return request({
    url: '/coal/number/' + coalNumber,
    method: 'put'
  })
}

// 【执行完成】
export function numberFinish(ids) {
  return request({
    url: '/coal/number/'+ids,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportNumber(query) {
  return request({
    url: '/coal/number/export',
    method: 'get',
    params: query
  })
}