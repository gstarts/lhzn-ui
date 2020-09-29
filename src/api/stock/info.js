import request from '@/utils/request'

// 查询库存信息列表
export function listInfo(query) {
  return request({
    url: '/stock/info/list',
    method: 'get',
    params: query
  })
}

// 查询库存流水信息
export function flowList(query) {
  return request({
    url: '/stock/flow/list',
    method: 'get',
    params: query
  })
}

// containerList 
export function containerList(query) {
  return request({
    url: '/stock/info/containerList',
    method: 'get',
    params: query
  })
}

// 查询库存信息详细
export function getInfo(id) {
  return request({
    url: '/stock/info/' + id,
    method: 'get'
  })
}

// 新增散杂货库存信息
export function addInfo(data) {
  return request({
    url: '/stock/info',
    method: 'post',
    data: data
  })
}

// 新增集装箱库存信息
export function insertInfo(data) {
  return request({
    url: '/stock/info/insert',
    method: 'post',
    data: data
  })
}

// 修改库存信息
export function updateInfo(data) {
  return request({
    url: '/stock/info',
    method: 'put',
    data: data
  })
}

// 删除库存信息
export function delInfo(id) {
  return request({
    url: '/stock/info/' + id,
    method: 'delete'
  })
}

// 导出库存信息
export function exportInfo(query) {
  return request({
    url: '/stock/info/export',
    method: 'get',
    params: query
  })
}

//查询仓库入库货物详情
export function putInfo(query){
  return request({
    url:'/stock/info/putInfo/' ,
    method: 'get',
    params: query 
  })
}

// 新增库存信息
export function getSGoodsDetail(data) {
  return request({
    url: '/stock/info/getSGoodsDetail',
    method: 'post',
    data: data
  })
}
//查询详细信息
export function selectInfo(query,query1,query2){
return request({
  url:'/stock/info/select',
  method:'get',
  params:{
    gCustomsNum: query,
    gCustomsBatchNum: query1,
    id:query2
  }
})
}
export function UpdateSGoodsInfo(data){
return request({
  url:'/stock/info/updatea',
  method:'put',
  data: data
})
}