import request from '@/utils/request'

// 查询申报车辆列表
export function listVehicle(query) {
  return request({
    url: '/waybill/vehicle/list',
    method: 'get',
    params: query
  })
}

// 查询申报车辆详细
export function getVehicle(id) {
  return request({
    url: '/waybill/vehicle/' + id,
    method: 'get'
  })
}

// 新增申报车辆
export function addVehicle(data) {
  return request({
    url: '/waybill/vehicle',
    method: 'post',
    data: data
  })
}

// 修改申报车辆
export function updateVehicle(data) {
  return request({
    url: '/waybill/vehicle',
    method: 'put',
    data: data
  })
}

// 删除申报车辆
export function delVehicle(id) {
  return request({
    url: '/waybill/vehicle/' + id,
    method: 'delete'
  })
}

// 导出申报车辆
export function exportVehicle(query) {
  return request({
    url: '/waybill/vehicle/export',
    method: 'get',
    params: query
  })
}

  // 下载导入模板
  export function importTemplate() {
    return request({
      url: '/waybill/vehicle/importTemplate',
      method: 'get'
    })
  }