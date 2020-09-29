import request from '@/utils/request'

// 查询数据监控列表
export function listData(query) {
  return request({
    url: '/monitor/data/list',
    method: 'get',
    params: query
  })
}

// 查询数据监控详细
export function getData(sessionId) {
  return request({
    url: '/monitor/data/' + sessionId,
    method: 'get'
  })
}

// 新增数据监控
export function addData(data) {
  return request({
    url: '/monitor/data',
    method: 'post',
    data: data
  })
}
// 人工抬杆
export function artificial(data) {
  return request({
    url: '/monitor/data/artificial',
    method: 'post',
    data: data
  })
}



// 修改数据监控
export function updateData(data) {
  return request({
    url: '/monitor/data',
    method: 'put',
    data: data
  })
}

// 补采操作
export function updateDataSet(data) {
  return request({
    url: '/monitor/data/set',
    method: 'put',
    data: data
  })
}

// 人工抬杆
export function updateDataLift(data) {
  return request({
    url: '/monitor/data/Lifter',
    method: 'put',
    data: data
  })
}

// 删除数据监控
export function delData(sessionId) {
  return request({
    url: '/monitor/data/' + sessionId,
    method: 'delete'
  })
}

// 导出数据监控
export function exportData(query) {
  return request({
    url: '/monitor/data/export',
    method: 'get',
    params: query
  })
}

//查询异常数据详情
export function detailsData(sessionId){
  return request({
    url:'/monitor/data/details/' + sessionId,
    method: 'get',
  })
}


