import request from '@/utils/request'

// 查询SysSiteMenuItems列表
export function listSysSiteMenuItems(query) {
    return request({
        url: '/api/v1/sys-site-menu-items',
        method: 'get',
        params: query
    })
}

// 查询SysSiteMenuItems详细
export function getSysSiteMenuItems (id) {
    return request({
        url: '/api/v1/sys-site-menu-items/' + id,
        method: 'get'
    })
}


// 新增SysSiteMenuItems
export function addSysSiteMenuItems(data) {
    return request({
        url: '/api/v1/sys-site-menu-items',
        method: 'post',
        data: data
    })
}

// 修改SysSiteMenuItems
export function updateSysSiteMenuItems(data) {
    return request({
        url: '/api/v1/sys-site-menu-items/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除SysSiteMenuItems
export function delSysSiteMenuItems(data) {
    return request({
        url: '/api/v1/sys-site-menu-items',
        method: 'delete',
        data: data
    })
}

