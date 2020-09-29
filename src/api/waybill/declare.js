import request from '@/utils/request'

// 查询提运单申报列表
export function listDeclare(query) {
  return request({
    url: '/waybill/declare/head/list',
    method: 'get',
    params: query
  })
}

// 查询提运单申报详细
export function getDeclare(id) {
  return request({
    url: '/waybill/declare/head/' + id,
    method: 'get'
  })
}

// 新增提运单表头
export function addHead(data) {
  return request({
    url: '/waybill/declare/head',
    method: 'post',
    data: data
  })
}

// 修改提运单表头信息
export function updateHead(data) {
  return request({
    url: '/waybill/declare/head',
    method: 'put',
    data: data
  })
}

// 提运单申报
export function declareWaybill(id) {
  return request({
    url: '/waybill/declare/head/' + id,
    method: 'delete'
  })
}

// 导出提运单申报
export function exportDeclare(query) {
  return request({
    url: '/waybill/declare/export',
    method: 'get',
    params: query
  })
}

// 新增提运单表头
export function addBody(data) {
  return request({
    url: '/waybill/declare/body',
    method: 'post',
    data: data
  })
}

// 修改提运单表体信息
export function updateBody(data) {
  return request({
    url: '/waybill/declare/body',
    method: 'put',
    data: data
  })
}

// 查询提运单表体列表
export function listbodyTable(query) {
  return request({
    url: '/waybill/declare/body/list',
    method: 'get',
    params: query
  })
}
// 查询提运单申报详细
export function getWaybillBody(id) {
  return request({
    url: '/waybill/declare/body/' + id,
    method: 'get'
  })
}
// 删除提运单体
export function delBody(id) {
  return request({
    url: '/waybill/declare/body/' + id,
    method: 'delete'
  })
}
// 提运单申报
export function addWaybill(head, body) {

  return request({
    url: '/waybill/declare/all',
    method: 'post',
    data: { head, body }
  })
}
// 自动分配
export function autoAllocation(data){
  return request({
    url: '/waybill/declare/allocation',
    method: 'post',
    data: data
  })
}

// 上传申报删除数据
export function del(id){
  return request({
    url: '/waybill/declare/del/' +id,
    method: 'delete',
  })
}
// 初始化页面方法
export function init(){
  return request({
    url: '/waybill/declare/init' ,
    method: 'get',
  })
}

// 初始化页面方法
export function wayListByuserId(query){
  return request({
    url: '/waybill/declare/waybillList' ,
    method: 'get',
    params: query
  })
}

// 车辆信息校验
export function check(vehicleNo,headId ){
  return request({
    url: '/waybill/declare/check/'+ vehicleNo+"/"+headId ,
    method: 'get'
  })
}

// 驳回按钮
export function subReject(id,message){
  return request({
    url: '/waybill/declare/reject/'+ id+"/"+message ,
    method: 'get'
  })
}
// 人工办结
export function artificial (id){
  return request({
    url: '/waybill/declare/artificial/'+ id ,
    method: 'get'
  })

}