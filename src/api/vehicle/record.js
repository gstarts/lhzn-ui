import request from '@/utils/request'

// 绑定 IC卡
export function bindIC(data){
  return request({
    url: '/vehicle/record/bind',
    method: 'put',
    data: data
  })
}

//解绑IC卡
export function uniteIC(id){
    return request({
      url: '/vehicle/record/unite/' + id,
      method: 'get'
  
  })
}

// 查询车牌号列表
export function licenselist(){
  return request({
    url: '/vehicle/record/licenselist',
    method: 'get',
  })
}

// 查询车辆备案列表
export function listRecord(query) {
  return request({
    url: '/vehicle/record/list',
    method: 'get',
    params: query
  })
}

// 查询车辆备案详细
export function getRecord(id) {
  return request({
    url: '/vehicle/record/' + id,
    method: 'get'
  })
}

// 新增车辆备案
export function addRecord(data) {
  return request({
    url: '/vehicle/record',
    method: 'post',
    data: data
  })
}

// 修改车辆备案
export function updateRecord(data) {
  return request({
    url: '/vehicle/record',
    method: 'put',
    data: data
  })
}

// 删除车辆备案
export function delRecord(id) {
  return request({
    url: '/vehicle/record/' + id,
    method: 'delete'
  })
}

// 导出车辆备案
export function exportRecord(query) {
  return request({
    url: '/vehicle/record/export',
    method: 'get',
    params: query
  })
}