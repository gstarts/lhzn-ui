import request from '@/utils/request'

// 查询通道配置列表
export function listChnlConfig(query) {
  return request({
    url: '/monitor/chnlConfig/list',
    method: 'get',
    params: query
  })
}

// 查询通道配置详细
export function getChnlConfig(id) {
  return request({
    url: '/monitor/chnlConfig/' + id,
    method: 'get'
  })
}

// 新增通道配置
export function addChnlConfig(data) {
  return request({
    url: '/monitor/chnlConfig',
    method: 'post',
    data: data
  })
}

// 修改通道配置
export function updateChnlConfig(data) {
  return request({
    url: '/monitor/chnlConfig',
    method: 'put',
    data: data
  })
}

// 删除通道配置
export function delChnlConfig(id) {
  return request({
    url: '/monitor/chnlConfig/' + id,
    method: 'delete'
  })
}

// 导出通道配置
export function exportChnlConfig(query) {
  return request({
    url: '/monitor/chnlConfig/export',
    method: 'get',
    params: query
  })
}
/**更改通道使用状态 */
export function changechnlStatus(id,status){
  const data = {
    id,
    status
  }
  return request({
    url: '/monitor/chnlConfig/changeStatus',
    method: 'put',
    data: data
  })
}

/** 通道列表 */
export function chnlList() {
  return request({
    url: '/monitor/chnlConfig/aisleList',
    method: 'get',
  })
}
