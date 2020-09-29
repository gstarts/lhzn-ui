import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listHead(query) {
  return request({
    url: '/report/head/list',
    method: 'get',
    params: query
  })
}

// 查询确报表头详细
export function getHead(messageId) {
  return request({
    url: '/report/head/' + messageId,
    method: 'get'
  })
}

// 查询新增页面确报表头详细
export function getInfoHead(query) {
  return request({
    url: '/report/head/info',
    method: 'get',
    params: query
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



// 修改【请填写功能名称】
export function updateHead(data) {
  return request({
    url: '/report/head',
    method: 'put',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateDeclare(data) {
  return request({
    url: '/report/head/updateDeclare',
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
// 查询挂车信息
export function getTransport(borderTransportMeansId) {
  return request({
    url: '/report/head/transport/' + borderTransportMeansId,
    method: 'get'
  })
}
// 获取挂车当前行信息
export function getTransportDetail(id) {
  return request({
    url: '/report/head/transportDetail/' + id,
    method: 'get'
  })
}

// 获取集装箱当前行信息
export function getCoalDetail(id) {
  return request({
    url: '/report/head/coalDetail/' + id,
    method: 'get'
  })
}
// 查询集装箱详细信息
export function getCoal(consignmentId) {
  return request({
    url: '/report/head/coal/' + consignmentId,
    method: 'get'
  })
}

// 新增页新增运输工具信息 
export function updateTransport(data) {
  return request({
    url: '/report/head/transport',
    method: 'put',
    data: data
  })
}


// 新增页新增集装箱信
export function updateCoal(data) {
  return request({
    url: '/report/head/updateCoal',
    method: 'put',
    data: data
  })
}

// 修改运输工具信息 
export function updateTransportInfor(data) {
  return request({
    url: '/report/head/transportInfor',
    method: 'put',
    data: data
  })
}


// 修改集装箱信
export function updateCoalInfor(data) {
  return request({
    url: '/report/head/updateCoalInfor',
    method: 'put',
    data: data
  })
}

