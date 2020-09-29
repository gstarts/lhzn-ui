import request from '@/utils/request'
import { data } from 'autoprefixer'



export function listHead(query) {
  return request({
    url: '/newemptycar/head/list',
    method: 'get',
    params: query
  })
}
//查询新增页空载列表
export function listemptycar(Lid) {
  return request({
    url: '/newemptycar/bordertransportequipment/add/' + Lid,
    method: 'get',
  })
}

// 查询空车表头详细
export function getHead(messageid) {
  return request({
    url: '/newemptycar/head/' + messageid,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addHead(data) {
  return request({
    url: '/report/head',
    method: 'post',
    data: data
  })
}
//新增空载挂车信息
export function emptycarAll(data) {
  return request({
    url: '/newemptycar/bordertransportequipment',
    method: 'post',
    data: data
  })
}
// 修改空载表头信息
export function updateHead(data) {
  return request({
    url: '/newemptycar/head',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delHead(pid) {
  return request({
    url: '/report/head/' + pid,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportHead(query) {
  return request({
    url: '/report/head/export',
    method: 'get',
    params: query

  })
}

//空载新增表头信息
export function addemptyCar(data) {
  return request({
    url: '/newemptycar/head/insertemptyCar',
    method: 'put',
    data: data
  })
}

export function updateCode(data){
  return request({
    url:'/newemptycar/head/updateCode',
    method:'put',
    data:data
  })
}

//新增页 初始化数据
export function init() {
  return request({
    url: '/newemptycar/head/init',
    method: 'get',
  })
}

export function getTransport(bordertransportmeansId) {
  return request({
    url: '/newemptycar/head/transportDetail/' + bordertransportmeansId,
    method: 'get',
  })
}

// 获取挂车当前行信息
export function getTransportDetail(id) {
  return request({
    url: '/newemptycar/head/transport/' + id,
    method: 'get',
  })
}

// 获取集装箱当前行信息
export function getCoalDetail(key) {
  return request({
    url: '/report/head/coalDetail/' + key,
    method: 'get'
  })
}
// 查询集装箱详细信息
export function getCoal(pId) {
  return request({
    url: '/report/head/coal/' + pId,
    method: 'get'
  })
}

// 修改运输工具信息 
export function updateTransport(data) {
  return request({
    url: '/newemptycar/head/updateCarall',
    method: 'put',
    data: data
  })
}


// 修改集装箱信
export function updateCoal(data) {
  return request({
    url: '/report/head/updateCoal',
    method: 'put',
    data: data
  })
}

