import request from '@/utils/request'

// 查询仓库合同列表
export function listContract(query) {
  return request({
    url: '/depot/contract/list',
    method: 'get',
    params: query
  })
}

// 查询仓库合同详细
export function getContract(id) {
  return request({
    url: '/depot/contract/' + id,
    method: 'get'
  })
}

// 新增仓库合同
export function addContract(data) {
  return request({
    url: '/depot/contract',
    method: 'post',
    data: data
  })
}

// 修改仓库合同
export function updateContract(data) {
  return request({
    url: '/depot/contract',
    method: 'put',
    data: data
  })
}

// 删除仓库合同
export function delContract(id) {
  return request({
    url: '/depot/contract/' + id,
    method: 'delete'
  })
}

// 导出仓库合同
export function exportContract(query) {
  return request({
    url: '/depot/contract/export',
    method: 'get',
    params: query
  })
}