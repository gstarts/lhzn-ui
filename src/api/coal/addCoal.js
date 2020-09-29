import request from '@/utils/request'

// 查询小提煤单列表
export function listPlate(query) {
    return request({
      url: '/coal/plate/list',
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

// 新增大提煤单
export function addNumber(data) {
  return request({
    url: '/coal/number',
    method: 'post',
    data: data
  })
}

// 新增小提煤单
export function addPlate(data) {
    return request({
      url: '/coal/plate',
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

// 删除【请填写功能名称】
export function delNumber(id) {
  return request({
    url: '/coal/plate/' + id,
    method: 'delete'
  })
}

// 导出大提煤单
export function exportNumber(query) {
    return request({
      url: '/coal/number/export',
      method: 'get',
      params: query
    })
  }

// 导出小提煤单
export function exportPlate(query) {
    return request({
      url: '/coal/plate/export',
      method: 'get',
      params: query
    })
  }

// 初始化页面方法
export function init(){
    return request({
      url: '/coal/number/init',
      method: 'get',
    })
  }

  // 提煤单信息
  export function getCoalInfo( coalNumber ){
    return request({
      url: '/coal/plate/info/' + coalNumber,
      method: 'get',
    })
  }

  // getplateList
  export function getplateList( coalNumber ){
    return request({
      url: '/coal/plate/list/' + coalNumber,
      method: 'get',
    })
  }