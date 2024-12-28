import request from '@/utils/request'

// 查询SysSiteContent列表
export function listSysSiteContent(query) {
  return request({
    url: '/api/v1/sys-site-content',
    method: 'get',
    params: query
  })
}

// 查询SysSiteContent详细
export function getSysSiteContent(id) {
  return request({
    url: '/api/v1/sys-site-content/' + id,
    method: 'get'
  })
}

// 新增SysSiteContent
export function addSysSiteContent(data) {
  return request({
    url: '/api/v1/sys-site-content',
    method: 'post',
    data: data
  })
}

// 修改SysSiteContent
export function updateSysSiteContent(data) {
  return request({
    url: '/api/v1/sys-site-content/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除SysSiteContent
export function delSysSiteContent(data) {
  return request({
    url: '/api/v1/sys-site-content',
    method: 'delete',
    data: data
  })
}

