import request from '@/utils/request'
// 查询场站通道列别表
export function chnllist() {
  return request({
    url: '/monitor/chnlConfig/chnllist',
    method: 'get'
  })
}
// 系统级通道树结构
export function Stationchnllist() {
  return request({
    url: '/monitor/chnlConfig/chnlTree',
    method: 'get'
  })
}
export function listEquipment(query) {
  return request({
    url: '/setting/equipment/list',
    method: 'get',
    params: query
  })
}

export function restart(id) {
  return request({
    url: '/setting/equipment/restart/' + id,
    method: 'get',
  })
}

// 新增设备
export function addEqmConfig(data) {
  return request({
    url: '/setting/equipment',
    method: 'post',
    data:data
  })
}
// 修改设备参数
export function updateEqmConfig(data) {
  return request({
    url: '/setting/equipment',
    method: 'put',
    data:data
  })
}

// 获取设备参数
export function getEqmInfo(id) {
  return request({
    url: '/setting/equipment/' + id,
    method: 'get',
  })
}

